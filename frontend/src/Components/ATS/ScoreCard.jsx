import { motion } from 'framer-motion';
import { TrendingUp, Target, FileCheck, AlertCircle } from 'lucide-react';

const ScoreCard = ({ resume }) => {
    const { atsScore } = resume;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getProgressColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                ATS Score Analysis
            </h3>

            {/* Main Score */}
            <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Original Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(atsScore?.original || 0)}`}>
                        {atsScore?.original || 0}%
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">
                        +{atsScore?.improvement || 0}%
                    </span>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Optimized Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(atsScore?.optimized || 0)}`}>
                        {atsScore?.optimized || 0}%
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{atsScore?.optimized || 0}/100</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${atsScore?.optimized || 0}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${getProgressColor(atsScore?.optimized || 0)} rounded-full`}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                    <FileCheck className="h-5 w-5 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="text-lg font-semibold text-gray-800">Optimized</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-green-600 mb-2" />
                    <p className="text-sm text-gray-600">ATS Ready</p>
                    <p className="text-lg font-semibold text-gray-800">Yes</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ScoreCard;
