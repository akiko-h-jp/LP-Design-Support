import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
];

export class GoogleDriveService {
  private auth: JWT | null = null;
  private drive: any = null;
  private docs: any = null;
  private rootFolderId: string | null = null;

  constructor() {
    const credentialsPath = process.env.GOOGLE_DRIVE_CREDENTIALS_PATH;
    const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON;
    const tokenPath = process.env.GOOGLE_DRIVE_TOKEN_PATH;
    const tokenJson = process.env.GOOGLE_DRIVE_TOKEN_JSON;
    this.rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || null;

    if (!credentialsPath && !credentialsJson) {
      throw new Error('GOOGLE_DRIVE_CREDENTIALS_PATHまたはGOOGLE_DRIVE_CREDENTIALS_JSONが設定されていません');
    }

    try {
      // credentials.jsonを読み込む（環境変数またはファイルから）
      let credentialsContent: string;
      if (credentialsJson) {
        // Vercelなど、環境変数から直接読み込む場合
        credentialsContent = credentialsJson;
        // JSONの検証（デバッグ用）
        console.log('[GoogleDriveService] Credentials JSON length:', credentialsContent.length);
        console.log('[GoogleDriveService] Credentials JSON first 100 chars:', credentialsContent.substring(0, 100));
        console.log('[GoogleDriveService] Credentials JSON last 100 chars:', credentialsContent.substring(Math.max(0, credentialsContent.length - 100)));
      } else if (credentialsPath) {
        // ローカル環境など、ファイルパスから読み込む場合
        credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
      } else {
        throw new Error('認証情報の取得方法が指定されていません');
      }
      
      let credentials: any;
      try {
        credentials = JSON.parse(credentialsContent);
      } catch (parseError) {
        console.error('[GoogleDriveService] JSON parse error at position:', parseError instanceof SyntaxError ? (parseError as any).message : String(parseError));
        console.error('[GoogleDriveService] JSON content length:', credentialsContent.length);
        // エラー位置の前後の文字を表示
        if (parseError instanceof SyntaxError) {
          const match = parseError.message.match(/position (\d+)/);
          if (match) {
            const position = parseInt(match[1], 10);
            const start = Math.max(0, position - 50);
            const end = Math.min(credentialsContent.length, position + 50);
            console.error('[GoogleDriveService] JSON around error position:', credentialsContent.substring(start, end));
          }
        }
        throw new Error(`認証情報のJSON解析に失敗しました: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }

      // JWT認証を使用（サービスアカウントまたはOAuth2クライアント）
      if (credentials.type === 'service_account') {
        // サービスアカウントの場合
        this.auth = new JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes: SCOPES,
        });
      } else {
        // OAuth2クライアントの場合
        const oauthConfig = credentials.installed || credentials.web;
        if (!oauthConfig) {
          throw new Error('OAuth2設定が見つかりません。credentials.jsonの形式を確認してください。');
        }
        const { client_secret, client_id, redirect_uris } = oauthConfig;
        const redirectUri = Array.isArray(redirect_uris) ? redirect_uris[0] : redirect_uris;
        const oAuth2Client = new OAuth2Client(client_id, client_secret, redirectUri);

        // トークンが存在する場合は読み込む（環境変数またはファイルから）
        let token: any = null;
        if (tokenJson) {
          // Vercelなど、環境変数から直接読み込む場合
          try {
            token = JSON.parse(tokenJson);
            oAuth2Client.setCredentials(token);
            this.auth = oAuth2Client as any;
          } catch (tokenError) {
            throw new Error(
              `トークンの解析に失敗しました: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`
            );
          }
        } else if (tokenPath && fs.existsSync(tokenPath)) {
          // ローカル環境など、ファイルパスから読み込む場合
          try {
            token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
            oAuth2Client.setCredentials(token);
            this.auth = oAuth2Client as any;
          } catch (tokenError) {
            throw new Error(
              `トークンファイルの読み込みに失敗しました: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`
            );
          }
        } else {
          throw new Error(
            'OAuth2トークンが見つかりません。初回認証が必要です。\n' +
            'GOOGLE_DRIVE_TOKEN_JSONまたはGOOGLE_DRIVE_TOKEN_PATHを設定するか、認証フローを実行してください。\n' +
            `設定されたパス: ${tokenPath || '未設定'}\n` +
            `環境変数: ${tokenJson ? '設定済み' : '未設定'}`
          );
        }
      }

      // this.authがnullでないことを確認
      if (!this.auth) {
        throw new Error('認証情報の初期化に失敗しました');
      }

      // Google Drive APIとGoogle Docs APIを初期化
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.docs = google.docs({ version: 'v1', auth: this.auth });
    } catch (error) {
      console.error('Google Drive認証エラー:', error);
      throw new Error(
        `Google Drive認証に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * フォルダ名で既存のフォルダを検索
   */
  async findFolderByName(folderName: string, parentFolderId?: string): Promise<string | null> {
    try {
      let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      
      if (parentFolderId) {
        query += ` and '${parentFolderId}' in parents`;
      } else if (this.rootFolderId) {
        query += ` and '${this.rootFolderId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name)',
        pageSize: 10,
      });

      const folders = response.data.files;
      if (folders && folders.length > 0) {
        // 完全一致するフォルダを探す
        const exactMatch = folders.find((f: any) => f.name === folderName);
        if (exactMatch) {
          return exactMatch.id;
        }
        return folders[0].id;
      }

      return null;
    } catch (error) {
      console.error('フォルダ検索エラー:', error);
      return null;
    }
  }

  /**
   * 案件フォルダを作成（既存のフォルダがある場合は検索して使用）
   */
  async createProjectFolder(projectName: string): Promise<string> {
    try {
      // 既存のフォルダを検索
      const existingFolderId = await this.findFolderByName(projectName);
      if (existingFolderId) {
        return existingFolderId;
      }

      // 既存のフォルダがない場合は新規作成
      const folderMetadata = {
        name: projectName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(this.rootFolderId && { parents: [this.rootFolderId] }),
      };

      const folder = await this.drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      const folderId = folder.data.id;
      if (!folderId) {
        throw new Error('フォルダIDが取得できませんでした');
      }

      return folderId;
    } catch (error) {
      console.error('フォルダ作成エラー:', error);
      throw new Error(
        `フォルダ作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Google Docsファイルを作成
   */
  async createDocument(title: string, content: string, folderId?: string): Promise<string> {
    try {
      // ファイルメタデータ
      const fileMetadata: any = {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      // ファイルを作成
      const file = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      const fileId = file.data.id;
      if (!fileId) {
        throw new Error('ファイルIDが取得できませんでした');
      }

      // 内容を書き込む
      if (content) {
        await this.docs.documents.batchUpdate({
          documentId: fileId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: {
                    index: 1,
                  },
                  text: content,
                },
              },
            ],
          },
        });
      }

      return fileId;
    } catch (error) {
      console.error('ドキュメント作成エラー:', error);
      throw new Error(
        `ドキュメント作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Google Docsファイルの内容を読み込む
   */
  async readDocument(fileId: string): Promise<string> {
    try {
      const document = await this.docs.documents.get({
        documentId: fileId,
      });

      if (!document.data.body || !document.data.body.content) {
        return '';
      }

      // ドキュメントの内容をテキストに変換
      let text = '';
      const extractText = (element: any): string => {
        if (element.textRun) {
          return element.textRun.content || '';
        }
        if (element.paragraph && element.paragraph.elements) {
          return element.paragraph.elements
            .map((e: any) => extractText(e))
            .join('');
        }
        if (element.table) {
          // テーブルの場合は簡略化
          return '';
        }
        return '';
      };

      for (const element of document.data.body.content) {
        text += extractText(element);
      }

      return text;
    } catch (error) {
      console.error('ドキュメント読み込みエラー:', error);
      throw new Error(
        `ドキュメント読み込みに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * フォルダ内のファイル一覧を取得
   */
  async listFilesInFolder(folderId: string): Promise<Array<{ id: string; name: string; mimeType: string; modifiedTime?: string }>> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, modifiedTime)',
        pageSize: 100,
      });

      return (response.data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
      }));
    } catch (error) {
      console.error('ファイル一覧取得エラー:', error);
      throw new Error(
        `ファイル一覧取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * プロジェクトフォルダ一覧を取得（ルートフォルダ内のフォルダ一覧）
   */
  async listProjectFolders(): Promise<Array<{ id: string; name: string; createdTime: string; modifiedTime: string }>> {
    try {
      let query = "mimeType='application/vnd.google-apps.folder' and trashed=false";
      
      if (this.rootFolderId) {
        query += ` and '${this.rootFolderId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, createdTime, modifiedTime)',
        orderBy: 'modifiedTime desc',
        pageSize: 100,
      });

      return (response.data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        createdTime: file.createdTime || '',
        modifiedTime: file.modifiedTime || '',
      }));
    } catch (error) {
      console.error('プロジェクトフォルダ一覧取得エラー:', error);
      throw new Error(
        `プロジェクトフォルダ一覧取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * ファイルをエクスポート（JSON形式など）
   * Google Docsファイルの場合は、exportメソッドを使用
   */
  async exportFile(fileId: string, mimeType: string = 'text/plain'): Promise<string> {
    try {
      // まずファイルのメタデータを取得してMIMEタイプを確認
      const fileMetadata = await this.drive.files.get({
        fileId: fileId,
        fields: 'mimeType',
      });

      const fileMimeType = fileMetadata.data.mimeType;

      // Google Docsファイルの場合はexportメソッドを使用
      if (fileMimeType === 'application/vnd.google-apps.document') {
        const response = await this.drive.files.export({
          fileId: fileId,
          mimeType: mimeType,
        }, {
          responseType: 'text',
        });
        return response.data as string;
      } else {
        // 通常のファイルの場合は直接ダウンロード
        const response = await this.drive.files.get({
          fileId: fileId,
          alt: 'media',
        }, {
          responseType: 'text',
        });
        return response.data as string;
      }
    } catch (error) {
      console.error('ファイルエクスポートエラー:', error);
      throw new Error(
        `ファイルエクスポートに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
