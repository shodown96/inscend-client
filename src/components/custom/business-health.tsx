import { Button } from "../ui/button";


interface BusinessHealthProps {
    healthScore: number;
    issuesCount: number;
    opportunitiesCount: number;
    onAskBrainstorm?: () => void;
    onViewFullReport?: () => void;
}

export const BusinessHealthStatus = ({
    healthScore = 75,
    issuesCount = 2,
    opportunitiesCount = 3,
    onAskBrainstorm,
    onViewFullReport
}: BusinessHealthProps) => {
    // Determine health status based on score
    const getHealthStatus = (score: number) => {
        if (score >= 75) return { label: 'GOOD', color: 'text-green-700' };
        if (score >= 50) return { label: 'FAIR', color: 'text-yellow-700' };
        return { label: 'NEEDS ATTENTION', color: 'text-red-700' };
    };

    const healthStatus = getHealthStatus(healthScore);

    // Calculate stroke dash offset for circular progress
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (healthScore / 100) * circumference;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                {/* Left Section: Progress Circle and Status */}
                <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative size-24">
                        <svg className="size-24 transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke="#065f46"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                            />
                        </svg>
                        {/* Percentage text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-900">{healthScore}%</span>
                        </div>
                    </div>

                    {/* Status Text */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Overall Business Health: <span className={healthStatus.color}>{healthStatus.label}</span>
                        </h2>
                        <div className="flex items-center gap-6 text-gray-700">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{issuesCount}</span>
                                <span className="text-gray-600">issues need attention</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{opportunitiesCount}</span>
                                <span className="text-gray-600">opportunities available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-4">
                    <Button onClick={onAskBrainstorm}>
                        Ask Brainstorm
                    </Button>
                    <Button
                        onClick={onViewFullReport}
                        variant={'outline'}>
                        View Full Report
                    </Button>
                </div>
            </div>
        </div>
    );
};
