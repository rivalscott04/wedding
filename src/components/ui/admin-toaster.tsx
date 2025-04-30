import { useToast } from "@/hooks/use-admin-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/admin-toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export function AdminToaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center gap-3">
              {variant === "success" && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {variant === "destructive" && (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {variant === "info" && (
                <Info className="h-5 w-5 text-blue-600" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
