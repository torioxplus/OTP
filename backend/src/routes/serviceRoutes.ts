import { Router, Request, Response } from 'express';
import { memoryStore } from '../store/memoryStore.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const serviceRouter = Router();

serviceRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { getSupabase, isSupabaseConfigured } = await import('../lib/supabase.js');
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabase()
        .from('services')
        .select('*')
        .order('selling_price', { ascending: true });
      if (!error && data && data.length > 0) {
        const services = data.map((s: Record<string, any>) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          serviceCode: s.service_code,
          category: s.category,
          countryCode: s.country_code,
          sellingPrice: Number(s.selling_price),
          minimumMargin: Number(s.minimum_margin),
          maximumProviderCost: Number(s.maximum_provider_cost),
          providerCostEstimate: Number(s.provider_cost_estimate),
          enabled: s.enabled,
          successRate: Number(s.success_rate),
          avgSpeedSeconds: s.avg_speed_seconds,
          iconName: s.icon_name,
        }));
        res.json({ success: true, data: { services } });
        return;
      }
    }
  } catch (err) {
    console.warn('Supabase services fetch error, falling back to memory store:', err);
  }

  const services = Array.from(memoryStore.services.values());
  res.json({
    success: true,
    data: { services },
  });
});

serviceRouter.get('/countries', async (_req: Request, res: Response) => {
  try {
    const { getSupabase, isSupabaseConfigured } = await import('../lib/supabase.js');
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabase().from('countries').select('*');
      if (!error && data && data.length > 0) {
        const countries = data.map((c: Record<string, any>) => ({
          code: c.code,
          name: c.name,
          dialCode: c.dial_code,
          flag: c.flag,
        }));
        res.json({ success: true, data: { countries } });
        return;
      }
    }
  } catch (err) {
    console.warn('Supabase countries fetch error, falling back to memory store:', err);
  }

  const countries = Array.from(memoryStore.countries.values());
  res.json({
    success: true,
    data: { countries },
  });
});

serviceRouter.get('/providers', (_req: Request, res: Response) => {
  const providers = Array.from(memoryStore.providers.values()).sort((a, b) => a.priority - b.priority);
  res.json({
    success: true,
    data: { providers },
  });
});

serviceRouter.post('/providers/:id/sync', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const providerId = req.params.id as string;
  const provider = memoryStore.providers.get(providerId);
  if (!provider) {
    res.status(404).json({ success: false, error: 'Provider not found' });
    return;
  }

  // Trigger live sync
  const { providerService } = await import('../services/providerService.js');
  await providerService.syncProviderBalances();

  res.json({
    success: true,
    message: `Provider ${provider.name} synced with live carrier API`,
    data: { provider: memoryStore.providers.get(providerId) },
  });
});


serviceRouter.get('/:id', (req: Request, res: Response) => {
  const service = memoryStore.services.get(req.params.id as string);
  if (!service) {
    res.status(404).json({
      success: false,
      error: 'Service not found',
    });
    return;
  }
  res.json({
    success: true,
    data: { service },
  });
});
