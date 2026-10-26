import { config } from '../config/index.js';

export interface TigerOrderResult {
  success: boolean;
  orderId?: string;
  phoneNumber?: string;
  error?: string;
  raw?: unknown;
}

export interface TigerCheckResult {
  status: 'PENDING' | 'RECEIVED' | 'CANCELED' | 'TIMEOUT' | 'FINISHED' | 'UNKNOWN';
  code?: string;
  fullSms?: string;
  error?: string;
}

const COUNTRY_MAP: Record<string, string> = {
  IN: '22',
  US: '187',
  GB: '16',
  RU: '0',
  ID: '6',
  BR: '73',
  PH: '4',
  VN: '10',
  NG: '19',
};

const SERVICE_MAP: Record<string, string> = {
  whatsapp: 'wa',
  telegram: 'tg',
  openai: 'dr',
  google: 'go',
  instagram: 'ig',
  facebook: 'fb',
  discord: 'ds',
  amazon: 'am',
};

export class TigerSmsProvider {
  private baseUrl = 'https://api.tiger-sms.com/stubs/handler_api.php';

  public async getBalance(): Promise<number | null> {
    if (!config.tigerSmsApiKey) return null;

    try {
      const url = `${this.baseUrl}?api_key=${config.tigerSmsApiKey}&action=getBalance`;
      const res = await fetch(url);
      const text = (await res.text()).trim();

      if (text.startsWith('ACCESS_BALANCE:')) {
        const bal = parseFloat(text.split(':')[1]);
        return isNaN(bal) ? 0 : bal;
      }
      return null;
    } catch (err) {
      console.error('[Tiger SMS] getBalance error:', err);
      return null;
    }
  }

  public async buyNumber(countryCode: string = 'IN', serviceSlug: string = 'telegram'): Promise<TigerOrderResult> {
    if (!config.tigerSmsApiKey) {
      return { success: false, error: 'Tiger SMS API key not configured' };
    }

    try {
      const countryId = COUNTRY_MAP[countryCode.toUpperCase()] || '22';
      const serviceCode = SERVICE_MAP[serviceSlug.toLowerCase()] || serviceSlug.toLowerCase();

      const url = `${this.baseUrl}?api_key=${config.tigerSmsApiKey}&action=getNumber&service=${serviceCode}&country=${countryId}`;
      const res = await fetch(url);
      const text = (await res.text()).trim();

      if (text.startsWith('ACCESS_NUMBER:')) {
        const parts = text.split(':');
        const orderId = parts[1];
        let phoneNumber = parts[2];

        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+${phoneNumber}`;
        }

        return {
          success: true,
          orderId,
          phoneNumber,
          raw: text,
        };
      }

      return {
        success: false,
        error: text || 'Failed to acquire number from Tiger SMS',
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  public async checkOrder(orderId: string): Promise<TigerCheckResult> {
    if (!config.tigerSmsApiKey) {
      return { status: 'UNKNOWN', error: 'API key not configured' };
    }

    try {
      const url = `${this.baseUrl}?api_key=${config.tigerSmsApiKey}&action=getStatus&id=${orderId}`;
      const res = await fetch(url);
      const text = (await res.text()).trim();

      if (text.startsWith('STATUS_OK:')) {
        const code = text.split(':')[1];
        return {
          status: 'RECEIVED',
          code,
          fullSms: `Your verification code is ${code}`,
        };
      }

      if (text === 'STATUS_WAIT_CODE' || text === 'STATUS_WAIT_RETRY') {
        return { status: 'PENDING' };
      }

      if (text === 'STATUS_CANCEL') {
        return { status: 'CANCELED' };
      }

      return { status: 'PENDING', error: text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { status: 'UNKNOWN', error: msg };
    }
  }

  public async cancelOrder(orderId: string): Promise<boolean> {
    if (!config.tigerSmsApiKey) return false;

    try {
      const url = `${this.baseUrl}?api_key=${config.tigerSmsApiKey}&action=setStatus&status=8&id=${orderId}`;
      const res = await fetch(url);
      const text = (await res.text()).trim();
      return text === 'ACCESS_CANCEL';
    } catch {
      return false;
    }
  }

  public async finishOrder(orderId: string): Promise<boolean> {
    if (!config.tigerSmsApiKey) return false;

    try {
      const url = `${this.baseUrl}?api_key=${config.tigerSmsApiKey}&action=setStatus&status=6&id=${orderId}`;
      const res = await fetch(url);
      const text = (await res.text()).trim();
      return text === 'ACCESS_ACTIVATION';
    } catch {
      return false;
    }
  }
}

export const tigerSmsProvider = new TigerSmsProvider();
