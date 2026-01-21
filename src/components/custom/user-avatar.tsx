import { getInitials } from '@/lib/utils'
import type { User } from '@/types/auth'
import { useState } from 'react'

export default function UserAvatar({ user }: { user: User | null }) {
    const [avatarURL, setAvatarURL] = useState(user?.avatar?.url)
    return (
        <>
            {avatarURL ? (
                <img src={avatarURL} alt="" className="size-8 rounded-full" onError={() => setAvatarURL("")} />
            ) : (
                <div className="bg-primary text-white rounded-full size-8 flex justify-center items-center text-sm">
                    {getInitials(user?.name)}
                </div>
            )}
        </>
    )
}
