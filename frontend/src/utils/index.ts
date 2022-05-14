const fallbackCopyTextToClipboard = (text: string, onSuccess: () => void, onError: () => void) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    if (document.execCommand('copy')) {
      onSuccess();
    } else {
      onError();
    }
  } catch (err) {
    onError();
  }
  document.body.removeChild(textArea);
};

export const copyTextToClipboard = (text: string, onSuccess: () => void, onError: () => void) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, onSuccess, onError);
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    onSuccess();
  }, () => {
    fallbackCopyTextToClipboard(text, onSuccess, onError);
  });
};

export const timeSince = (date: string): string => {
  const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};
