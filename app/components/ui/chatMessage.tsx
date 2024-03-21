import { Avatar } from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const roleAttributes = {
  assistant: {
    imgSrc: "/bot.png",
    imgAlt: "Assistant's avatar",
    bgColor: "bg-white",
    dropShadow: "",
  },
  user: {
    imgSrc: "/profile.png",
    imgAlt: "User's avatar",
    bgColor: "bg-indigo-100",
    dropShadow: "drop-shadow",
  },
};

const avatarVariants = cva("self-start h-6 w-6 sm:w-10 sm:h-10 ", {
  variants: {
    variant: {
      default: "",
      assistant: "",
      user: "",
    },
  },
  defaultVariants: {
    variant: "assistant",
  },
});

export const AvatarWrapper = (
  props: VariantProps<typeof avatarVariants> & {
    children: React.ReactNode;
  }
) => {
  return (
    <Avatar className={cn(avatarVariants(props))}>{props.children}</Avatar>
  );
};
