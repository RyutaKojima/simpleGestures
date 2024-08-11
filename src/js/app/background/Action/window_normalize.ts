import Window = chrome.windows.Window;

export default async (): Promise<void> => {
  const currentWindow: Window = await chrome.windows.getCurrent();

  await chrome.windows.update(
    currentWindow.id,
    {
      state: 'normal',
    },
  );
};
