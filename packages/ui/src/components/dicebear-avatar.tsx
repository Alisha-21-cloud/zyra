"use client";

import { glass } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { useMemo } from 'react';
import { Avatar, AvatarImage } from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';

interface DicebearAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
};

export const DicebearAvatar = ({
    seed,
    size = 32,
    className,
    imageUrl,
    badgeClassName,
    badgeImageUrl
}: DicebearAvatarProps) => {
    const avatarSrc = useMemo(() => {
        if(imageUrl) {
            return imageUrl;
        }

        const avatar = createAvatar(glass,{
            seed: seed.toLowerCase().trim(),
            size,
        });

        return avatar.toDataUri();
    }, [seed, size]);

    const badgeSize = Math.round(size * 0.5);

    return (
        <div
            className="relative inline-block"
            style={{ width: size, height: size }}
        >
            <Avatar
                className={cn("border", className)}
                style={{ width: size, height: size }}
            >
                <AvatarImage alt="Avatar" src={avatarSrc} />
            </Avatar>
            {badgeImageUrl && (
                <div
                    className={cn("absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background", badgeClassName)}
                    style={{ width: badgeSize, height: badgeSize, transform: "translate(15%, 15%)" }}
                >
                    <img
                        alt="Badge"
                        className="h-full w-full object-cover"
                        height={badgeSize}
                        width={badgeSize}
                        src={badgeImageUrl}
                    />
                </div>
            )}

        </div>
    )
}