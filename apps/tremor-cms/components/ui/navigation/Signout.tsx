import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  //DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { cx } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"

export const Signout = () => {
  const { signOut } = useClerk()
  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger
          className={cx(
            "w-full",
            // base
            "group/DropdownMenuItem relative flex cursor-pointer select-none items-center rounded py-1.5 pl-2 pr-1 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
            // text color
            "text-gray-900 dark:text-gray-50",
            // disabled
            "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:hover:bg-none dark:data-[disabled]:text-gray-600",
            // focus
            "focus-visible:bg-gray-100 focus-visible:dark:bg-gray-900",
            // hover
            "hover:bg-gray-100 hover:dark:bg-gray-900",
          )}
        >
          Sign out
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Are you sure ?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                className="mt-2 w-full sm:mt-0 sm:w-fit"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="w-full !bg-red-400 !text-white sm:w-fit"
                //onClick={() => signOut()}
                onClickCapture={async () => {
                  await signOut({ redirectUrl: "/sign-in" })
                }}
              >
                Sign out
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
