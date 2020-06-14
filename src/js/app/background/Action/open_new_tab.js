import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (options) => {
  const newUrl = (options && options.href) || null;
  chromeTabs.createActiveRight(newUrl);
};
