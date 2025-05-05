import React, { useRef, useState } from "react";
import { LucideEdit, LucideMoreHorizontal, LucideTrash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Chat } from "../pages/chat";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";

interface Props {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chat: Chat;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, name: string) => Promise<void>;
}

const SidebarChatListElement = ({
  setCurrentChatId,
  currentChatId,
  renameChat,
  deleteChat,
  chat,
}: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(chat.name);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <li
      onClick={() => setCurrentChatId(chat.id)}
      className={` border flex items-center justify-between h-11 relative group max-w-full py-2 text-sm mx-4 rounded-md px-2  cursor-pointer ${
        chat.id === currentChatId
          ? "bg-secondary border-secondary"
          : " border-transparent"
      }`}
    >
      {!renaming && (
        <p className={` max-w-full truncate absolute w-[80%]`}>{name}</p>
      )}

      {renaming && (
        <Input
          type="text"
          className={` ${
            renaming ? "opacity-100" : "opacity-0 pointer-events-none"
          }  px-0 !h-fit absolute w-[80%]`}
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Escape") {
              setRenaming(false);
              setName(chat.name);
            }
            if (e.key === "Enter") {
              if (name.length === 0) return;
              renameChat(chat.id, name)
                .catch(() => setName(chat.name))
                .finally(() => {
                  setRenaming(false);
                });
            }
          }}
          autoFocus
        />
      )}
      <Popover>
        <PopoverTrigger className="cursor-pointer opacity-0 group-hover:opacity-100 transition absolute right-2">
          <LucideMoreHorizontal className="size-5" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-fit flex flex-col gap-2"
        >
          <Button
            size={"sm"}
            variant={"outline"}
            className="justify-start"
            onClick={() => {
              setRenaming(true);
              inputRef.current?.focus();
            }}
          >
            <LucideEdit />
            Rename
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              setShowDialog(true);
            }}
            // onClick={() => deleteChat(chat.id)}
            className="justify-start"
            variant={"destructive"}
          >
            <LucideTrash2 />
            Delete
          </Button>
        </PopoverContent>
      </Popover>
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDialog(false);
                deleteChat(chat.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
};

export default SidebarChatListElement;
