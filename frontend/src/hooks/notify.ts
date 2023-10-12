import { OptionsWithExtraProps, SnackbarMessage, VariantType, useSnackbar } from 'notistack';
import { useCallback } from 'react';

const defaultOptions: OptionsWithExtraProps<VariantType> = {
  variant: 'info',
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
};

export default function useNotify() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = useCallback(
    (message: SnackbarMessage, variant: VariantType, options: OptionsWithExtraProps<VariantType> = {}) => {
      enqueueSnackbar(message, { ...defaultOptions, ...options, variant });
    },
    [enqueueSnackbar]
  );
  return {
    enqueueSnackbar,
    closeSnackbar,
    notify,
  };
}
