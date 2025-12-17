import { Context, createContext, RefObject, useContext } from "react"

type AppRefContext = RefObject<HTMLDivElement>

const AppRefContext: Context<AppRefContext | undefined> = createContext<
  AppRefContext | undefined
>(undefined)

export default AppRefContext

export function useAppRefContext(): AppRefContext {
  const context: AppRefContext | undefined = useContext(AppRefContext)
  if (context === undefined) {
    throw new Error("useTodoContext must be within TodoProvider")
  }

  return context
}
