interface GoogleCredentialResponse {
  credential: string; // JWT ID Token
  select_by: string;
  clientId: string;
}

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
        }) => void;
        prompt: () => void; // One Tap 팝업
        renderButton: (
          // 구글 로그인 버튼 렌더링
          element: HTMLElement,
          options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            width?: number;
          }
        ) => void;
        disableAutoSelect: () => void;
      };
    };
  };
}
