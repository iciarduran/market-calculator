import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, AlertCircle, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';

export default function MarketEntryCalculator() {
  // Market Inputs - ALL START AT 0
  const [continent, setContinent] = useState('Europe');
  const [country, setCountry] = useState('Switzerland');
  const [segment, setSegment] = useState('Enterprise');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [penetrationY1, setPenetrationY1] = useState(0);
  const [penetrationY2, setPenetrationY2] = useState(0);
  const [penetrationY3, setPenetrationY3] = useState(0);
  const [salesCycle, setSalesCycle] = useState(0);
  const [gtmType, setGtmType] = useState('sales-led');

  // Pricing - START AT 0
  const [asp, setAsp] = useState(0);
  const [pricingModel, setPricingModel] = useState('subscription');

  // Costs - ALL START AT 0
  const [legalSetup, setLegalSetup] = useState(0);
  const [compliance, setCompliance] = useState(0);
  const [localization, setLocalization] = useState(0);
  const [launchCampaign, setLaunchCampaign] = useState(0);
  const [toolsIntegrations, setToolsIntegrations] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [smPercent, setSmPercent] = useState(0);
  const [opsPercent, setOpsPercent] = useState(0);
  const [fixedHeadcount, setFixedHeadcount] = useState(0);

  // Calculations
  const [results, setResults] = useState({
    y1: { revenue: 0, costs: 0, margin: 0, cumulative: 0, customers: 0 },
    y2: { revenue: 0, costs: 0, margin: 0, cumulative: 0, customers: 0 },
    y3: { revenue: 0, costs: 0, margin: 0, cumulative: 0, customers: 0 },
    breakeven: '',
    cumulativeProfit: 0,
    roi: 0,
    decision: '',
    confidence: '',
    entryInvestment: 0
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

  // Excel Download Function
  const downloadExcel = () => {
    const csvContent = `Market Entry Calculator - Results
Generated: ${new Date().toLocaleDateString()}

INPUTS
Market Information
Continent,${continent}
Segment,${segment}
Total Addressable Customers,${totalCustomers}
Sales Cycle (months),${salesCycle}
Go-to-Market Type,${gtmType}

Market Penetration
Year 1,%,${penetrationY1}
Year 2,%,${penetrationY2}
Year 3,%,${penetrationY3}

Pricing
Average Annual Price (ASP),CHF,${asp}
Pricing Model,${pricingModel}

Fixed Entry Costs
Legal & Entity Setup,CHF,${legalSetup}
Compliance / Certifications,CHF,${compliance}
Localization,CHF,${localization}
Launch Campaign,CHF,${launchCampaign}
Tools & Integrations,CHF,${toolsIntegrations}
Other Costs,CHF,${otherCosts}
Total Entry Investment,CHF,${results.entryInvestment}

Ongoing Costs
Sales & Marketing,% of revenue,${smPercent}
Operations / Support,% of revenue,${opsPercent}
Fixed Headcount Costs,CHF/year,${fixedHeadcount}

RESULTS
3-Year Projections
Metric,Year 1,Year 2,Year 3
Customers,${Math.round(results.y1.customers)},${Math.round(results.y2.customers)},${Math.round(results.y3.customers)}
Revenue,${results.y1.revenue},${results.y2.revenue},${results.y3.revenue}
Total Costs,${results.y1.costs},${results.y2.costs},${results.y3.costs}
Contribution Margin,${results.y1.margin},${results.y2.margin},${results.y3.margin}
Cumulative Profit,${results.y1.cumulative},${results.y2.cumulative},${results.y3.cumulative}

Key Metrics
Break-even Year,${results.breakeven}
3-Year Cumulative Profit,CHF,${results.cumulativeProfit}
ROI,%,${results.roi.toFixed(1)}

Decision
Recommendation,${results.decision}
Confidence Level,${results.confidence}

Decision Logic
GO: Break-even ≤ Year 2 AND ROI > 30%
NO GO: Break-even > Year 3 AND ROI < 15%
REVIEW: All other scenarios

Powered by Pricing4Scale.com
`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `market-entry-calculator-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logoBase64 = 'data:image/png;base64,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1dMxpM/wO7xWvJaVgZI2YfmqloBA2dHR0ekgggjXlpRU6qmKrTe/LJejb/0b2UWNyaXmn67FQctVUOTW+jqMV4jyHHL5QztlgrIKDwx0jvohg7neiD6aXVGK1VXXYxaqy4RPhrJ6OKSdj29JbIWAuBHp332VUUdF7Q96udDHdLljmPUdPOySaSkb4rp2g92lvfYPy20K6e+u52VS11qcIwWNs9G3/tlnSwalKTzv3WD6iIuaXQiIgCIiAIiIAuWv4RIgYdiTjv8A0lKOx/6pdSqPZphWK5pDRw5VY6W7RUUpmp2VAJax5GidA6Pb5reuXJJMxJZWD+W1rgq7jUtprbQ1FbO46EcEbpXH8GhdWeztxhnbuIOSLJcrFPZaq/0cUFuNe3wet3TICSO7mgdQ8x6rq2yWOy2OmFNZbRQW2EDQZS07Ih/hAWxU89VKSwiONSTycm4f7Hga5k2X5nJIexdBbIekfUeJJs/4Qrz434ewHAKwXDHrS8XERmP7ZUTull6TrY7nQ3oeQCn6KOV9klhs2VcV0Rjigghc90UMcbnnqeWtALj8z81kRFCbhERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAf/Z';

  return (
    <div className="min-h-screen bg-blue-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <Calculator className="w-8 h-8 text-white" />
              Market Entry Calculator
            </h1>
            <p className="text-white text-lg">
              Should we enter this market, at what price, and with what expected return?
            </p>
          </div>
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src={logoBase64}
              alt="Pricing4Scale Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Market Inputs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Target className="w-5 h-5 text-blue-600" />
              1. Market Inputs
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Target Continent</label>
                <select 
                  value={continent} 
                  onChange={(e) => setContinent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
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
                <label className="block text-sm font-medium mb-1 text-gray-700">Target Segment</label>
                <select 
                  value={segment} 
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option>Enterprise</option>
                  <option>Mid-Market</option>
                  <option>SMB</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Total Addressable Customers</label>
                <input 
                  type="number" 
                  value={totalCustomers}
                  onChange={(e) => setTotalCustomers(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">Market Penetration (%)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Year 1</label>
                    <input 
                      type="number" 
                      value={penetrationY1}
                      onChange={(e) => setPenetrationY1(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Year 2</label>
                    <input 
                      type="number" 
                      value={penetrationY2}
                      onChange={(e) => setPenetrationY2(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Year 3</label>
                    <input 
                      type="number" 
                      value={penetrationY3}
                      onChange={(e) => setPenetrationY3(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Sales Cycle (months)</label>
                <input 
                  type="number" 
                  value={salesCycle}
                  onChange={(e) => setSalesCycle(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Go-to-Market Type</label>
                <select 
                  value={gtmType} 
                  onChange={(e) => setGtmType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="self-serve">Self-serve</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="sales-led">Sales-led</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
              <DollarSign className="w-5 h-5 text-green-600" />
              2. Pricing & Revenue
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Average Annual Price per Customer (ASP)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={asp}
                    onChange={(e) => setAsp(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    step="1000"
                  />
                  <span className="text-sm font-medium text-gray-700">CHF</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Pricing Model</label>
                <select 
                  value={pricingModel} 
                  onChange={(e) => setPricingModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="subscription">Subscription</option>
                  <option value="per-seat">Per-seat</option>
                  <option value="usage-based">Usage-based</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fixed Entry Costs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              3. Fixed Entry Costs
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Legal & entity setup</label>
                <input 
                  type="number" 
                  value={legalSetup}
                  onChange={(e) => setLegalSetup(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Compliance / certifications</label>
                <input 
                  type="number" 
                  value={compliance}
                  onChange={(e) => setCompliance(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Localization</label>
                <input 
                  type="number" 
                  value={localization}
                  onChange={(e) => setLocalization(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Launch campaign</label>
                <input 
                  type="number" 
                  value={launchCampaign}
                  onChange={(e) => setLaunchCampaign(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Tools & integrations</label>
                <input 
                  type="number" 
                  value={toolsIntegrations}
                  onChange={(e) => setToolsIntegrations(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="font-medium text-gray-700">Other costs</label>
                <input 
                  type="number" 
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              <div className="pt-2 border-t border-gray-300">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total Entry Investment</span>
                  <span>{formatCurrency(results.entryInvestment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Costs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900">4. Ongoing Costs</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Sales & Marketing (% of revenue)</label>
                <input 
                  type="number" 
                  value={smPercent}
                  onChange={(e) => setSmPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Operations / Support (% of revenue)</label>
                <input 
                  type="number" 
                  value={opsPercent}
                  onChange={(e) => setOpsPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Fixed Headcount Costs (annual)</label>
                <input 
                  type="number" 
                  value={fixedHeadcount}
                  onChange={(e) => setFixedHeadcount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  step="10000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION - AT THE BOTTOM */}
        <div className="space-y-6">
          {/* Results Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Results</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Metric</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Year 1</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Year 2</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Year 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">Customers</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{Math.round(results.y1.customers)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{Math.round(results.y2.customers)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{Math.round(results.y3.customers)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">Revenue</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y1.revenue)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y2.revenue)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y3.revenue)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">Total Costs</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y1.costs)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y2.costs)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y3.costs)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">Contribution Margin</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y1.margin)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y2.margin)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{formatCurrency(results.y3.margin)}</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Cumulative Profit</td>
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

          {/* Download Button */}
          <div className="flex justify-center">
            <button
              onClick={downloadExcel}
              className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              <FileSpreadsheet className="w-6 h-6" />
              <span>Download Your Results (Excel)</span>
            </button>
          </div>

          {/* Decision Summary */}
          <div className={`p-6 rounded-lg border-2 shadow-lg ${getDecisionColor()}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {getDecisionIcon()}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{results.decision || 'Enter data above'}</h2>
                  <p className="text-sm text-gray-600">{results.confidence}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">3-Year Cumulative Profit</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.cumulativeProfit)}</div>
                <div className="text-sm text-gray-600 mt-1">ROI: {formatPercent(results.roi)} | Breakeven: Year {results.breakeven || '-'}</div>
              </div>
            </div>
          </div>

          {/* Decision Logic Info */}
          <div className="bg-white p-4 rounded-lg shadow text-sm text-gray-600">
            <p><strong className="text-gray-900">Decision Logic:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-green-600">GO:</strong> Breakeven ≤ Year 2 AND ROI &gt; 30%</li>
              <li><strong className="text-red-600">NO GO:</strong> Breakeven &gt; Year 3 AND ROI &lt; 15%</li>
              <li><strong className="text-orange-600">REVIEW:</strong> All other scenarios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
