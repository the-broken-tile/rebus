import { Context, createContext, RefObject, useContext } from "react"

export type AppRef = RefObject<HTMLDivElement>

const AppRefContext: Context<AppRef | undefined> = createContext<
  AppRef | undefined
>(undefined)

export default AppRefContext

export function useAppRefContext(): AppRef {
  const context: AppRef | undefined = useContext(AppRefContext)
  if (context === undefined) {
    throw new Error("useTodoContext must be within TodoProvider")
  }

  return context
}
