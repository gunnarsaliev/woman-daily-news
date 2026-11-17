import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BlogPostImage {
  src: string;
  alt: string;
}

interface BlogPostAuthor {
  name: string;
  image?: BlogPostImage;
  website?: string;
  websiteName?: string;
}

interface Blogpost1Props {
  title: string;
  description?: string;
  date?: string;
  datePrefix?: string;
  image?: BlogPostImage;
  body?: React.ReactNode;
  /** Shown beside the body on large screens and above it on small ones. */
  sidebar?: React.ReactNode;
  author?: BlogPostAuthor;
  className?: string;
}

const Blogpost1 = ({
  className,
  title,
  description,
  author,
  image,
  body,
  sidebar,
  date,
  datePrefix,
}: Blogpost1Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <h1 className="max-w-3xl text-4xl font-semibold text-pretty md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        ) : null}
        <div className="flex flex-col items-center gap-1 text-sm md:flex-row md:gap-2 md:text-base">
          {author ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={author.image?.src} alt={author.image?.alt} />
                <AvatarFallback>
                  {author.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">{author.name}</span>
            </div>
          ) : null}
          {author?.website && author.websiteName ? (
            <span className="text-muted-foreground">
              Owner of{" "}
              <a
                href={author.website}
                className="font-semibold text-foreground hover:underline"
              >
                {author.websiteName}
              </a>
            </span>
          ) : null}
          {date ? (
            <span className="text-muted-foreground">
              {datePrefix ? `${datePrefix} ` : null}
              {date}
            </span>
          ) : null}
        </div>
        {image ? (
          <div className="relative mt-4 mb-8 aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
      {sidebar ? (
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <aside className="flex flex-col gap-8 lg:order-last lg:sticky lg:top-8 lg:self-start">
            {sidebar}
          </aside>
          <div className="prose max-w-none dark:prose-invert">{body}</div>
        </div>
      ) : body ? (
        <div className="mx-auto prose max-w-3xl dark:prose-invert">{body}</div>
      ) : null}
    </section>
  );
};

export { Blogpost1 };
export type { Blogpost1Props };
