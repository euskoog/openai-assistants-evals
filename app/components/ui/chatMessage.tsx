import { Avatar } from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const roleAttributes = {
  assistant: {
    imgSrc: "/bot.png",
    imgAlt: "Assistant's avatar",
    dropShadow: "",
  },
  user: {
    imgSrc: "/profile.png",
    imgAlt: "User's avatar",
    dropShadow: "drop-shadow",
  },
};

const avatarVariants = cva(
  "rounded-full bg-white flex-shrink-0 self-start h-6 w-6 sm:w-10 sm:h-10 ",
  {
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
  }
);

export const AvatarWrapper = (
  props: VariantProps<typeof avatarVariants> & {
    children: React.ReactNode;
  }
) => {
  return (
    <Avatar className={cn(avatarVariants(props))}>{props.children}</Avatar>
  );
};
