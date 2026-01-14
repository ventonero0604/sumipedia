export const validateName = value => {
  if (!value.trim()) {
    return 'お名前を入力してください';
  }
  if (value.length > 20) {
    return '名前は21文字以上入力できません';
  }
  return null;
};

export const validateEmail = value => {
  if (!value.trim()) {
    return 'メールアドレスを入力してください';
  }
  if (value.length > 150) {
    return 'メールアドレスは151文字以上入力できません';
  }
  const alphanumericRegex = /^[a-zA-Z0-9@.]+$/;
  if (!alphanumericRegex.test(value)) {
    return 'メールアドレスは半角英数字で入力してください';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'メールアドレスの形式で入力してください';
  }
  return null;
};

export const validatePhoneNumber = value => {
  if (!value.trim()) {
    return null;
  }
  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(value)) {
    return '電話番号は半角数字で入力してください';
  }
  if (value.length < 10 || value.length > 11) {
    return '電話番号は10~11桁で入力してください';
  }
  return null;
};
