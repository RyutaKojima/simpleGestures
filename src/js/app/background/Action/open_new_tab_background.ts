import {GestureOptions} from '../../types/common';
import {isSafeUrl} from '../backgroundActions';
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (options: GestureOptions): Promise<void> => {
  const rawUrl: string | null = (options && options.href) || null;
  const newUrl: string | null = isSafeUrl(rawUrl) ? rawUrl : null;
  await chromeTabs.createActiveRight(newUrl, false);
};
