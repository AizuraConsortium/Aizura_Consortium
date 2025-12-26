import { useState } from 'react';
import { CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  traditional: boolean | string;
  playToEarn: boolean | string;
  aizuraU2E: boolean | string;
  details?: string;
}

export function ComparisonTable() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const comparisons: ComparisonRow[] = [
    {
      feature: 'Earn for Usage',
      traditional: false,
      playToEarn: false,
      aizuraU2E: true,
      details: 'Get rewarded for actually using services, not for repetitive tasks or speculation'
    },
    {
      feature: 'Sustainable Model',
      traditional: 'N/A',
      playToEarn: false,
      aizuraU2E: true,
      details: 'Rewards backed by real business profits, not dilutive token emissions'
    },
    {
      feature: 'Required Upfront Investment',
      traditional: false,
      playToEarn: 'Often Required',
      aizuraU2E: false,
      details: 'No NFTs to buy, no entry fees - just use the service and earn'
    },
    {
      feature: 'Real Value Creation',
      traditional: true,
      playToEarn: false,
      aizuraU2E: true,
      details: 'Services provide genuine utility beyond earning tokens'
    },
    {
      feature: 'Reward Longevity',
      traditional: 'N/A',
      playToEarn: '6-18 months',
      aizuraU2E: 'Infinite',
      details: 'Revenue-backed model can sustain rewards indefinitely'
    },
    {
      feature: 'Price Volatility Impact',
      traditional: 'N/A',
      playToEarn: 'High Risk',
      aizuraU2E: 'Low Risk',
      details: 'Rewards adjust based on profitability, not token price'
    },
    {
      feature: 'Speculative Farmers',
      traditional: 'N/A',
      playToEarn: 'Major Problem',
      aizuraU2E: 'Minimal',
      details: 'Rewards tied to genuine usage, not gaming the system'
    },
    {
      feature: 'Platform Quality',
      traditional: 'High',
      playToEarn: 'Variable',
      aizuraU2E: 'High',
      details: 'Service must be good enough that people use it without rewards'
    }
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-400 mx-auto" />
      );
    }
    return <span className="text-slate-300 text-sm font-medium">{value}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/50">
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-400 w-1/4">
                Feature
              </th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-slate-400 w-1/4">
                Traditional Platform
              </th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-slate-400 w-1/4">
                Play-to-Earn
              </th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-cyan-400 w-1/4">
                Aizura U2E
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, index) => (
              <tr
                key={index}
                className="border-t border-slate-800 hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === index ? null : index)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{row.feature}</span>
                    {row.details && (
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedRow === index ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                  {expandedRow === index && row.details && (
                    <p className="text-sm text-slate-400 mt-2">{row.details}</p>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {renderValue(row.traditional)}
                </td>
                <td className="py-4 px-6 text-center">
                  {renderValue(row.playToEarn)}
                </td>
                <td className="py-4 px-6 text-center bg-cyan-500/5">
                  {renderValue(row.aizuraU2E)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Accordion */}
      <div className="md:hidden space-y-3">
        {comparisons.map((row, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedRow(expandedRow === index ? null : index)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <span className="font-medium text-white">{row.feature}</span>
              {expandedRow === index ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedRow === index && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Traditional</span>
                  <div>{renderValue(row.traditional)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Play-to-Earn</span>
                  <div>{renderValue(row.playToEarn)}</div>
                </div>
                <div className="flex items-center justify-between bg-cyan-500/10 rounded-lg p-3">
                  <span className="text-sm font-medium text-cyan-400">Aizura U2E</span>
                  <div>{renderValue(row.aizuraU2E)}</div>
                </div>
                {row.details && (
                  <p className="text-sm text-slate-400 pt-2 border-t border-slate-700">
                    {row.details}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary callout */}
      <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-2">Why U2E Succeeds Where Play-to-Earn Failed</h4>
        <p className="text-slate-300 text-sm">
          Play-to-earn models collapsed because rewards weren't backed by real value. When token prices fell,
          the entire ecosystem died. Aizura's U2E model ties rewards directly to business profitability,
          creating a sustainable system that can operate indefinitely.
        </p>
      </div>
    </div>
  );
}
