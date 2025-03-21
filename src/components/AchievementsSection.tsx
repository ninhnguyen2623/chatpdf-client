import React from 'react'

export default function Nav() {
    return (
        <div className="hidden md:flex justify-center items-center mt-10 gap-10">
            <StatItem
                title="#1 PDF Chat AI"
                value="Nguyên bản"
                icon={<LaurelIcon />}
            />
            <StatItem
                title="Các câu hỏi được trả lời mỗi ngày"
                value="1.000.000+"
                icon={<ChatIcon />}
            />
            <StatItem title="Ứng dụng Gen AI của 2024" value="Top 50" icon={<A16ZIcon />} />
        </div>
    )
}

type StatItemProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
};

const StatItem: React.FC<StatItemProps> = ({ title, value, icon }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
                <LaurelIcon />
                <div>
                    <h3 className="text-sm text-gray-600">{title}</h3>
                    <div className="text-lg font-bold text-gray-900">{value}</div>
                </div>
                <LaurelIcon className="scale-x-[-1]" />
            </div>
            <div className="mt-2">{icon}</div>
        </div>
    );
};

const LaurelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 28 53"
        width="28"
        height="53"
        className={className}
    >
        <path fill="#60717A" d="M27 2q-1 3-7 4c0-2 3-6 7-4M17 8q2-2 2-8-3 2-2 8"></path>
        {/* Các path khác giữ nguyên */}
    </svg>
);

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="24" height="24">
        <g stroke="#268DE1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3">
            <path fill="#60717A" d="M27 2q-1 3-7 4c0-2 3-6 7-4M17 8q2-2 2-8-3 2-2 8"></path>
            <path fill="#60717A" d="M16 9q2-3 8-1-2 3-8 1m-2 3q2-2 1-8-3 2-1 8m0 0 7-1q-3 4-7 1m-3 5q3-4-1-8-3 3 1 8"></path>
            <path fill="#60717A" d="M11 17q3 1 8-2-3-4-8 2"></path><path fill="#60717A" d="M9 22q4 1 8-4-4-1-8 4"></path>
            <path fill="#60717A" d="M8 27q5 0 8-6-5 0-8 6"></path><path fill="#60717A" d="M9 31c1 0 6-2 6-6q-4 1-6 6"></path>
            <path fill="#60717A" d="M10 35q3 0 6-6-4 0-6 6"></path><path fill="#60717A" d="M12 38q3-1 4-6-4 0-4 6"></path>
            <path fill="#60717A" d="M14 41q2-1 3-6-3 0-3 6m3 4q3-1 2-7c-4 1-2 4-2 7"></path>
            <path fill="#60717A" d="M21 47q2-1 1-7-4 3-1 7"></path>
            <path fill="#60717A" d="M27 51v-1c-4-2-13-5-17-16-5-12 5-24 10-29-6 5-15 17-12 28 4 13 16 17 19 18"></path>
            <path fill="#60717A" d="M10 38c0-1-5-5-8-2q3 4 8 2m4 4c-1-1-5-4-8-1q3 4 8 1m3 3q-3-2-8 1 5 2 8-1m4 3q-3-2-8 2 5 2 8-2"></path>
            <path fill="#60717A" d="M9 22q2-4-2-9-3 4 2 9m-1 4c1-1 0-6-4-7-1 1 1 7 4 7m0 5c0-1-2-7-6-6 0 1 3 6 6 6m1 3c-1-1-4-5-8-3q2 4 8 3"></path>
        </g>
    </svg>
);

const A16ZIcon: React.FC = () => (
    <img alt="a16z logo" src="/_static/icons/a16z.png" className="w-6 h-6 rounded" />
);

