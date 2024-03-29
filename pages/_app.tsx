import { ReactNode, useContext } from "react";
import { app } from "@egvelho/next-mui/app";
import { Meta, MetaProps } from "@egvelho/next-meta/meta/meta";
import { theme } from "app/theme";
import { ContextProvider, Context } from "app/context";
import { Dash } from "app/dash/dash";
import { links } from "app/url";
import appConfig from "app.json";
import "@egvelho/next-mui/typography/typography.css";

function Layout({ children }: { children: ReactNode }) {
  return (
    <ContextProvider>
      <NestedLayout>{children}</NestedLayout>
    </ContextProvider>
  );
}

function NestedLayout({ children }: { children: ReactNode }) {
  const { context, setContext } = useContext(Context);

  return (
    <>
      <Meta
        {...(appConfig as MetaProps)}
        url={links.index.href}
        image="/android-chrome-512x512.png"
        keywords={[]}
      />
      <Dash
        snackbarContent={context.snackbarContent}
        setSnackbarContent={(snackbarContent) =>
          setContext({ snackbarContent })
        }
      >
        {children}
      </Dash>
    </>
  );
}

export default app({
  Layout,
  theme,
});
