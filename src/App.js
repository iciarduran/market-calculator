import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MarketEntryCalculator() {
  // Market Inputs
  const [continent, setContinent] = useState('Europe');
  const [country, setCountry] = useState('Switzerland');
  const [segment, setSegment] = useState('Enterprise');
  const [totalCustomers, setTotalCustomers] = useState(1000);
  const [penetrationY1, setPenetrationY1] = useState(2);
  const [penetrationY2, setPenetrationY2] = useState(5);
  const [penetrationY3, setPenetrationY3] = useState(10);
  const [salesCycle, setSalesCycle] = useState(3);
  const [gtmType, setGtmType] = useState('sales-led');

  // Pricing
  const [asp, setAsp] = useState(50000);
  const [pricingModel, setPricingModel] = useState('subscription');

  // Costs
  const [legalSetup, setLegalSetup] = useState(10000);
  const [compliance, setCompliance] = useState(15000);
  const [localization, setLocalization] = useState(20000);
  const [launchCampaign, setLaunchCampaign] = useState(25000);
  const [toolsIntegrations, setToolsIntegrations] = useState(5000);
  const [otherCosts, setOtherCosts] = useState(0);
  const [smPercent, setSmPercent] = useState(30);
  const [opsPercent, setOpsPercent] = useState(15);
  const [fixedHeadcount, setFixedHeadcount] = useState(100000);

  // Calculations
  const [results, setResults] = useState({
    y1: { revenue: 0, costs: 0, margin: 0, cumulative: 0 },
    y2: { revenue: 0, costs: 0, margin: 0, cumulative: 0 },
    y3: { revenue: 0, costs: 0, margin: 0, cumulative: 0 },
    breakeven: '',
    cumulativeProfit: 0,
    roi: 0,
    decision: '',
    confidence: ''
  });

  useEffect(() => {
    calculateResults();
  }, [totalCustomers, penetrationY1, penetrationY2, penetrationY3, asp, 
      legalSetup, compliance, localization, launchCampaign, toolsIntegrations, 
      otherCosts, smPercent, opsPercent, fixedHeadcount]);

  const calculateResults = () => {
    // Fixed entry costs
    const entryInvestment = legalSetup + compliance + localization + launchCampaign + toolsIntegrations + otherCosts;

    // Year 1
    const customersY1 = totalCustomers * (penetrationY1 / 100);
    const revenueY1 = customersY1 * asp;
    const smCostY1 = revenueY1 * (smPercent / 100);
    const opsCostY1 = revenueY1 * (opsPercent / 100);
    const totalCostY1 = smCostY1 + opsCostY1 + fixedHeadcount;
    const marginY1 = revenueY1 - totalCostY1;
    const cumulativeY1 = marginY1 - entryInvestment;

    // Year 2
    const customersY2 = totalCustomers * (penetrationY2 / 100);
    const revenueY2 = customersY2 * asp;
    const smCostY2 = revenueY2 * (smPercent / 100);
    const opsCostY2 = revenueY2 * (opsPercent / 100);
    const totalCostY2 = smCostY2 + opsCostY2 + fixedHeadcount;
    const marginY2 = revenueY2 - totalCostY2;
    const cumulativeY2 = marginY2 + cumulativeY1;

    // Year 3
    const customersY3 = totalCustomers * (penetrationY3 / 100);
    const revenueY3 = customersY3 * asp;
    const smCostY3 = revenueY3 * (smPercent / 100);
    const opsCostY3 = revenueY3 * (opsPercent / 100);
    const totalCostY3 = smCostY3 + opsCostY3 + fixedHeadcount;
    const marginY3 = revenueY3 - totalCostY3;
    const cumulativeY3 = marginY3 + cumulativeY2;

    // Decision metrics
    let breakeven = '>3 years';
    if (cumulativeY1 > 0) breakeven = '1';
    else if (cumulativeY2 > 0) breakeven = '2';
    else if (cumulativeY3 > 0) breakeven = '3';

    const roi = entryInvestment > 0 ? ((cumulativeY3 / entryInvestment) * 100) : 0;
    
    const penetrationSensitivity = penetrationY3 < 0.5 ? 'High' : 'Low';
    const pricingSensitivity = 'Low'; // Simplified for this demo
    
    let decision = 'REVIEW';
    if (breakeven <= 2 && roi > 30) decision = 'GO';
    else if (breakeven === '>3 years' && roi < 15) decision = 'NO GO';

    let confidence = 'Low sensitivity';
    if (penetrationSensitivity === 'High') confidence = 'High sensitivity';

    setResults({
      y1: { 
        revenue: revenueY1, 
        costs: totalCostY1, 
        margin: marginY1, 
        cumulative: cumulativeY1,
        customers: customersY1 
      },
      y2: { 
        revenue: revenueY2, 
        costs: totalCostY2, 
        margin: marginY2, 
        cumulative: cumulativeY2,
        customers: customersY2 
      },
      y3: { 
        revenue: revenueY3, 
        costs: totalCostY3, 
        margin: marginY3, 
        cumulative: cumulativeY3,
        customers: customersY3 
      },
      breakeven,
      cumulativeProfit: cumulativeY3,
      roi,
      decision,
      confidence,
      entryInvestment
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getDecisionIcon = () => {
    if (results.decision === 'GO') return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (results.decision === 'NO GO') return <AlertCircle className="w-8 h-8 text-red-600" />;
    return <AlertTriangle className="w-8 h-8 text-orange-600" />;
  };

  const getDecisionColor = () => {
    if (results.decision === 'GO') return 'bg-green-50 border-green-300';
    if (results.decision === 'NO GO') return 'bg-red-50 border-red-300';
    return 'bg-orange-50 border-orange-300';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          Market Entry Calculator
        </h1>
        <p className="text-gray-600">
          Should we enter this market, at what price, and with what expected return?
        </p>
      </div>

      {/* Decision Summary */}
      <div className={`mb-8 p-6 rounded-lg border-2 ${getDecisionColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getDecisionIcon()}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{results.decision}</h2>
              <p className="text-sm text-gray-600">{results.confidence}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">3-Year Cumulative Profit</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.cumulativeProfit)}</div>
            <div className="text-sm text-gray-600 mt-1">ROI: {formatPercent(results.roi)} | Breakeven: Year {results.breakeven}</div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Metric</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Year 1</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Year 2</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Customers</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(results.y1.customers)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(results.y2.customers)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(results.y3.customers)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Revenue</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y1.revenue)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y2.revenue)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y3.revenue)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Total Costs</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y1.costs)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y2.costs)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y3.costs)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Contribution Margin</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y1.margin)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y2.margin)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(results.y3.margin)}</td>
            </tr>
            <tr className="bg-blue-50">
              <td className="border border-gray-300 px-4 py-2 font-bold">Cumulative Profit</td>
              <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${results.y1.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(results.y1.cumulative)}
              </td>
              <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${results.y2.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(results.y2.cumulative)}
              </td>
              <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${results.y3.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(results.y3.cumulative)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Input Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Market Inputs */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            1. Market Inputs
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Continent</label>
              <select 
                value={continent} 
                onChange={(e) => setContinent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Europe</option>
                <option>North America</option>
                <option>Asia</option>
                <option>South America</option>
                <option>Africa</option>
                <option>Oceania</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Segment</label>
              <select 
                value={segment} 
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Enterprise</option>
                <option>Mid-Market</option>
                <option>SMB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Addressable Customers</label>
              <input 
                type="number" 
                value={totalCustomers}
                onChange={(e) => setTotalCustomers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">Market Penetration (%)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Year 1</label>
                  <input 
                    type="number" 
                    value={penetrationY1}
                    onChange={(e) => setPenetrationY1(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Year 2</label>
                  <input 
                    type="number" 
                    value={penetrationY2}
                    onChange={(e) => setPenetrationY2(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Year 3</label>
                  <input 
                    type="number" 
                    value={penetrationY3}
                    onChange={(e) => setPenetrationY3(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sales Cycle (months)</label>
              <input 
                type="number" 
                value={salesCycle}
                onChange={(e) => setSalesCycle(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Go-to-Market Type</label>
              <select 
                value={gtmType} 
                onChange={(e) => setGtmType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="self-serve">Self-serve</option>
                <option value="hybrid">Hybrid</option>
                <option value="sales-led">Sales-led</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            2. Pricing & Revenue
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Average Annual Price per Customer (ASP)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={asp}
                  onChange={(e) => setAsp(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  step="1000"
                />
                <span className="text-sm font-medium">CHF</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pricing Model</label>
              <select 
                value={pricingModel} 
                onChange={(e) => setPricingModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="subscription">Subscription</option>
                <option value="per-seat">Per-seat</option>
                <option value="usage-based">Usage-based</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fixed Entry Costs */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            3. Fixed Entry Costs
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Legal & entity setup</label>
              <input 
                type="number" 
                value={legalSetup}
                onChange={(e) => setLegalSetup(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Compliance / certifications</label>
              <input 
                type="number" 
                value={compliance}
                onChange={(e) => setCompliance(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Localization</label>
              <input 
                type="number" 
                value={localization}
                onChange={(e) => setLocalization(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Launch campaign</label>
              <input 
                type="number" 
                value={launchCampaign}
                onChange={(e) => setLaunchCampaign(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Tools & integrations</label>
              <input 
                type="number" 
                value={toolsIntegrations}
                onChange={(e) => setToolsIntegrations(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="font-medium">Other costs</label>
              <input 
                type="number" 
                value={otherCosts}
                onChange={(e) => setOtherCosts(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="pt-2 border-t border-orange-300">
              <div className="flex justify-between font-bold">
                <span>Total Entry Investment</span>
                <span>{formatCurrency(results.entryInvestment)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Costs */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">4. Ongoing Costs</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sales & Marketing (% of revenue)</label>
              <input 
                type="number" 
                value={smPercent}
                onChange={(e) => setSmPercent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Operations / Support (% of revenue)</label>
              <input 
                type="number" 
                value={opsPercent}
                onChange={(e) => setOpsPercent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fixed Headcount Costs (annual)</label>
              <input 
                type="number" 
                value={fixedHeadcount}
                onChange={(e) => setFixedHeadcount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                step="10000"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p><strong>Decision Logic:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>GO:</strong> Breakeven ≤ Year 2 AND ROI &gt; 30%</li>
          <li><strong>NO GO:</strong> Breakeven &gt; Year 3 AND ROI &lt; 15%</li>
          <li><strong>REVIEW:</strong> All other scenarios</li>
        </ul>
      </div>
    </div>
  );
}
