import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // "agro" fica fora do next-intl: a seção /agro é pt-BR e tem layout próprio
  matcher: ["/((?!api|agro|_next|_vercel|.*\\..*).*)"],
};
