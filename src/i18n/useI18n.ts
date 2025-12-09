import { useI18nContext } from "./I18nProvider";

export const useI18n = () => {
  const ctx = useI18nContext();
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx.t;
};
