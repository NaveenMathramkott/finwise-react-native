type AlertOptions = {
  title: string;
  subtitle?: string;
  message: string;
  buttons: {
    text: string;
    onPress?: () => void;
    style?: "cancel" | "destructive" | "default";
  }[];
};

type AlertRef = {
  show: (options: AlertOptions) => void;
  hide: () => void;
};

let alertRef: AlertRef | null = null;

export const setAlertRef = (ref: AlertRef | null) => {
  alertRef = ref;
};

export const showAlert = (
  title: string,
  subtitle: string,
  message: string,
  onConfirm?: () => void,
  onCancel?: () => void,
) => {
  alertRef?.show({
    title,
    subtitle,
    message,
    buttons: [
      {
        text: "Cancel",
        onPress: onCancel,
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: onConfirm,
        style: "destructive",
      },
    ],
  });
};

export const CustomAlert = {
  show: (options: AlertOptions) => {
    alertRef?.show(options);
  },
  hide: () => {
    alertRef?.hide();
  },
  alert: showAlert, // Alias to match simpler call
};
