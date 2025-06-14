import React, { useState, useCallback, useMemo, useEffect, createContext, useContext, useRef } from 'react';
import { Plus, Trophy, Users, Lightbulb, Monitor, PenTool, ArrowLeft, Zap, Settings, Eye, EyeOff, Database, Download, Search, Filter } from 'lucide-react';

// 🌍 グローバル状態管理（課題管理と学生入力を分離）
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const allChallenges = [
    '環境問題の解決策', 'AIと人間の共存', '高齢化社会への対応', 
    '教育格差の解消', '食料問題の解決', 'エネルギー問題への取り組み',
    '都市部の交通渋滞解消', 'デジタルデバイド対策', '働き方改革の推進',
    '医療費削減の方法', '地方創生のアイデア', '災害対策の強化',
    '若者の政治参加促進', 'プラスチック廃棄物削減', '子育て支援の充実',
    '企業のSDGs推進', 'メンタルヘルスケア', '観光業の復活',
    'スマートシティの実現', '国際協力の推進'
  ];

  // ワークショップ管理（メモリ内で管理）
  const [workshops, setWorkshops] = useState({});
  const [currentWorkshopId, setCurrentWorkshopId] = useState(null);

  // 現在のワークショップのデータを取得
  const currentWorkshop = currentWorkshopId ? workshops[currentWorkshopId] : null;
  
  const [solutions, setSolutions] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [customChallenges, setCustomChallenges] = useState([]);

  // ワークショップの作成
  const createWorkshop = useCallback((name) => {
    const id = `ws_${Date.now()}`;
    const newWorkshop = {
      id,
      name,
      createdAt: new Date().toISOString(),
      solutions: [],
      activeChallenges: [],
      customChallenges: []
    };
    
    setWorkshops(prev => ({ ...prev, [id]: newWorkshop }));
    setCurrentWorkshopId(id);
    setSolutions([]);
    setActiveChallenges([]);
    setCustomChallenges([]);
    
    return id;
  }, []);

  // ワークショップの切り替え
  const switchWorkshop = useCallback((workshopId) => {
    const workshop = workshops[workshopId];
    if (workshop) {
      setCurrentWorkshopId(workshopId);
      setSolutions(workshop.solutions || []);
      setActiveChallenges(workshop.activeChallenges || []);
      setCustomChallenges(workshop.customChallenges || []);
    }
  }, [workshops]);

  // データの保存（ワークショップごと）
  useEffect(() => {
    if (currentWorkshopId && workshops[currentWorkshopId]) {
      setWorkshops(prev => ({
        ...prev,
        [currentWorkshopId]: {
          ...prev[currentWorkshopId],
          solutions,
          activeChallenges,
          customChallenges
        }
      }));
    }
  }, [solutions, activeChallenges, customChallenges, currentWorkshopId]);

  // 📊 安定した課題リスト（参照固定）
  const stableChallengeList = useMemo(() => {
    return [...allChallenges, ...customChallenges];
  }, [customChallenges.length]);

  // 📌 安定したアクティブ課題リスト（参照固定）
  const stableActiveChallenges = useMemo(() => {
    return activeChallenges.slice().sort();
  }, [activeChallenges]);

  // Context値をメモ化して再レンダリングを最小化
  const value = useMemo(
    () => ({
      solutions,
      setSolutions,
      activeChallenges,
      setActiveChallenges,
      customChallenges,
      setCustomChallenges,
      allChallenges,
      stableChallengeList,
      stableActiveChallenges,
      workshops,
      setWorkshops,
      currentWorkshopId,
      setCurrentWorkshopId,
      currentWorkshop,
      createWorkshop,
      switchWorkshop
    }),
    [solutions, activeChallenges, customChallenges, stableChallengeList, stableActiveChallenges, workshops, currentWorkshopId, currentWorkshop, createWorkshop, switchWorkshop]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// 🔐 管理者認証コンポーネント（独立化）
const AdminAuth = React.memo(({ onSuccess, onCancel }) => {
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = () => {
    const val = inputRef.current.value.trim();
    if (val === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('パスワードが間違っています');
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              管理者認証
            </h1>
            <p className="text-gray-500 text-sm">
              管理者パスワードを入力してください
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                ref={inputRef}
                type="password"
                autoFocus
                placeholder="管理者パスワード"
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 transition-colors"
              />
              
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 font-medium"
              >
                ログイン
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl transition-colors duration-200"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 📝 基本入力コンポーネント
const TextInput = ({ label, value, onChange, placeholder, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

const TextArea = ({ label, value, onChange, placeholder, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={8}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-vertical"
      />
      <div className="text-right mt-1 text-sm text-gray-500">
        {value.length} 文字
      </div>
    </div>
  );
};

// 🔧 安定化されたSelect コンポーネント
const StableSelect = ({ label, value, onChange, options, placeholder, required = false }) => {
  const stableOptions = useMemo(() => {
    return options.map(option => ({
      id: `opt-${option}`,
      value: option,
      label: option
    }));
  }, [options]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {stableOptions.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// 🎓 学生フォームコンポーネント（完全分離）
const StudentForm = () => {
  const { stableActiveChallenges, setSolutions, currentWorkshop } = useAppContext();
  
  const [formData, setFormData] = useState({
    challenge: '',
    groupName: '',
    studentName: '',
    what: '',
    why: '',
    how: ''
  });

  // ワークショップが選択されていない場合
  if (!currentWorkshop) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">ワークショップが開始されていません</h3>
        <p className="text-red-700">管理者がワークショップを開始するまでお待ちください。</p>
      </div>
    );
  }

  const handleChallengeChange = useCallback((e) => {
    const newValue = e.target.value;
    if (newValue === '' || stableActiveChallenges.includes(newValue)) {
      setFormData(prev => ({ ...prev, challenge: newValue }));
    }
  }, [stableActiveChallenges]);

  const handleGroupNameChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, groupName: e.target.value }));
  }, []);

  const handleStudentNameChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, studentName: e.target.value }));
  }, []);

  const handleWhatChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, what: e.target.value }));
  }, []);

  const handleWhyChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, why: e.target.value }));
  }, []);

  const handleHowChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, how: e.target.value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const { challenge, groupName, studentName, what, why, how } = formData;
    
    // Howの文字数チェック
    if (how.length < 50) {
      alert('「How（どう解決するか）」は50文字以上入力してください。');
      return;
    }
    
    if (challenge && groupName && studentName && what && why && how) {
      // 3つの要素を結合してソリューションとして保存
      const combinedSolution = `【What（どんな課題か）】\n${what}\n\n【Why（なぜ重要か）】\n${why}\n\n【How（どう解決するか）】\n${how}`;
      
      const newSolution = {
        id: Date.now(),
        challenge,
        groupName,
        studentName,
        solution: combinedSolution,
        timestamp: new Date().toLocaleString('ja-JP')
      };
      setSolutions(prev => [...prev, newSolution]);
      setFormData({
        challenge: '',
        groupName: '',
        studentName: '',
        what: '',
        why: '',
        how: ''
      });
      alert('アイデアが投稿されました！');
    } else {
      alert('すべての項目を入力してください。');
    }
  }, [formData, setSolutions]);

  React.useEffect(() => {
    if (formData.challenge && !stableActiveChallenges.includes(formData.challenge)) {
      setFormData(prev => ({ ...prev, challenge: '' }));
    }
  }, [formData.challenge, stableActiveChallenges]);

  // Howの文字数が50文字未満かチェック
  const isHowTooShort = formData.how.length > 0 && formData.how.length < 50;

  return (
    <div className="space-y-6">
      {/* 現在のワークショップ情報 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-blue-800 text-sm">
          <strong>現在のワークショップ:</strong> {currentWorkshop.name}
        </p>
      </div>

      {stableActiveChallenges.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
          <p className="text-yellow-800">管理者が課題を設定していません</p>
        </div>
      ) : (
        <StableSelect
          label="課題を選択"
          value={formData.challenge}
          onChange={handleChallengeChange}
          options={stableActiveChallenges}
          placeholder="課題を選択してください"
          required
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="グループ名"
          value={formData.groupName}
          onChange={handleGroupNameChange}
          placeholder="例: チームAlpha"
          required
        />
        <TextInput
          label="お名前"
          value={formData.studentName}
          onChange={handleStudentNameChange}
          placeholder="例: 田中太郎"
          required
        />
      </div>

      {/* アイデアの詳細セクション */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">アイデアの詳細</h3>
        
        <TextArea
          label="What（どんな課題か）"
          value={formData.what}
          onChange={handleWhatChange}
          placeholder="解決したい課題を具体的に説明してください..."
          required
        />

        <TextArea
          label="Why（なぜ重要か）"
          value={formData.why}
          onChange={handleWhyChange}
          placeholder="この課題を解決することがなぜ重要なのか説明してください..."
          required
        />

        <div>
          <TextArea
            label="How（どう解決するか）"
            value={formData.how}
            onChange={handleHowChange}
            placeholder="課題をどのように解決するか、具体的な方法を説明してください...（最低50文字）"
            required
          />
          {isHowTooShort && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                あと{50 - formData.how.length}文字以上入力してください（現在: {formData.how.length}文字）
              </p>
            </div>
          )}
          {formData.how.length >= 50 && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                ✓ 文字数の条件を満たしています（{formData.how.length}文字）
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!formData.challenge || !formData.groupName || !formData.studentName || !formData.what || !formData.why || !formData.how || formData.how.length < 50}
        className="w-full py-4 px-6 rounded-2xl transition-all duration-300 font-medium shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {(!formData.challenge || !formData.groupName || !formData.studentName || !formData.what || !formData.why || !formData.how)
          ? 'すべての項目を入力してください' 
          : formData.how.length < 50
          ? `Howを${50 - formData.how.length}文字以上追加してください`
          : 'アイデアを投稿'
        }
      </button>
    </div>
  );
};

// 📊 データ管理コンポーネント
const DataManagement = () => {
  const { solutions, workshops, currentWorkshopId } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [exportMode, setExportMode] = useState('current'); // 'current' or 'all'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'challenge', 'group'
  const [filterByLength, setFilterByLength] = useState('all'); // 'all', 'short', 'medium', 'long'

  // フィルタリング用のオプション
  const uniqueChallenges = useMemo(() => {
    return [...new Set(solutions.map(s => s.challenge))];
  }, [solutions]);

  const uniqueGroups = useMemo(() => {
    return [...new Set(solutions.map(s => s.groupName))];
  }, [solutions]);

  // フィルタリング済みのソリューション
  const filteredSolutions = useMemo(() => {
    let filtered = solutions.filter(solution => {
      const matchesSearch = searchTerm === '' || 
        solution.challenge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.solution.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesChallenge = selectedChallenge === '' || solution.challenge === selectedChallenge;
      const matchesGroup = selectedGroup === '' || solution.groupName === selectedGroup;
      
      // 文字数フィルター
      let matchesLength = true;
      if (filterByLength !== 'all') {
        const solutionLength = solution.solution.length;
        if (filterByLength === 'short') matchesLength = solutionLength < 300;
        else if (filterByLength === 'medium') matchesLength = solutionLength >= 300 && solutionLength < 800;
        else if (filterByLength === 'long') matchesLength = solutionLength >= 800;
      }
      
      return matchesSearch && matchesChallenge && matchesGroup && matchesLength;
    });

    // ソート処理
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'challenge':
          return a.challenge.localeCompare(b.challenge);
        case 'group':
          return a.groupName.localeCompare(b.groupName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [solutions, searchTerm, selectedChallenge, selectedGroup, filterByLength, sortBy]);

  // CSV出力機能（改善版）
  const exportToCSV = useCallback(() => {
    let dataToExport = [];
    let filename = '';

    if (exportMode === 'current') {
      // 現在のワークショップのみ
      dataToExport = filteredSolutions;
      const workshopName = workshops[currentWorkshopId]?.name || 'データ';
      filename = `${workshopName}_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // 全ワークショップ
      Object.entries(workshops).forEach(([wsId, workshop]) => {
        workshop.solutions.forEach(solution => {
          dataToExport.push({
            ...solution,
            workshopName: workshop.name
          });
        });
      });
      filename = `全ワークショップ_${new Date().toISOString().split('T')[0]}.csv`;
    }

    if (dataToExport.length === 0) {
      alert('エクスポートするデータがありません');
      return;
    }

    const headers = exportMode === 'all' 
      ? ['ワークショップ名', '投稿日時', '課題', 'グループ名', 'お名前', 'What（どんな課題か）', 'Why（なぜ重要か）', 'How（どう解決するか）']
      : ['投稿日時', '課題', 'グループ名', 'お名前', 'What（どんな課題か）', 'Why（なぜ重要か）', 'How（どう解決するか）'];
    
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(solution => {
        // ソリューションテキストを解析してWhat/Why/Howを抽出
        const whatMatch = solution.solution.match(/【What（どんな課題か）】\n([\s\S]*?)\n\n【Why/);
        const whyMatch = solution.solution.match(/【Why（なぜ重要か）】\n([\s\S]*?)\n\n【How/);
        const howMatch = solution.solution.match(/【How（どう解決するか）】\n([\s\S]*?)$/);
        
        const what = whatMatch ? whatMatch[1].trim() : solution.solution;
        const why = whyMatch ? whyMatch[1].trim() : '';
        const how = howMatch ? howMatch[1].trim() : '';

        const row = exportMode === 'all' 
          ? [
              `"${solution.workshopName || ''}"`,
              `"${solution.timestamp}"`,
              `"${solution.challenge}"`,
              `"${solution.groupName}"`,
              `"${solution.studentName}"`,
              `"${what.replace(/"/g, '""')}"`,
              `"${why.replace(/"/g, '""')}"`,
              `"${how.replace(/"/g, '""')}"`
            ]
          : [
              `"${solution.timestamp}"`,
              `"${solution.challenge}"`,
              `"${solution.groupName}"`,
              `"${solution.studentName}"`,
              `"${what.replace(/"/g, '""')}"`,
              `"${why.replace(/"/g, '""')}"`,
              `"${how.replace(/"/g, '""')}"`
            ];
        
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredSolutions, workshops, currentWorkshopId, exportMode]);

  // フィルタリセット
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedChallenge('');
    setSelectedGroup('');
    setFilterByLength('all');
    setSortBy('newest');
  }, []);

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Search className="w-5 h-5 mr-2" />
            検索・フィルター
          </h3>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            リセット
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キーワード検索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="課題、グループ名、名前、内容で検索..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              課題で絞り込み
            </label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">すべての課題</option>
              {uniqueChallenges.map(challenge => (
                <option key={challenge} value={challenge}>{challenge}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              グループで絞り込み
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">すべてのグループ</option>
              {uniqueGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文字数でフィルター
            </label>
            <select
              value={filterByLength}
              onChange={(e) => setFilterByLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              <option value="short">短い（300文字未満）</option>
              <option value="medium">中（300-800文字）</option>
              <option value="long">長い（800文字以上）</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              並び替え
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="challenge">課題名順</option>
              <option value="group">グループ名順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 統計・エクスポート */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredSolutions.length}</div>
              <div className="text-sm text-gray-500">表示中のアイデア</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{solutions.length}</div>
              <div className="text-sm text-gray-500">総アイデア数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{uniqueGroups.length}</div>
              <div className="text-sm text-gray-500">参加グループ数</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={exportMode}
              onChange={(e) => setExportMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="current">現在のWSのみ</option>
              <option value="all">全WS</option>
            </select>
            <button
              onClick={exportToCSV}
              disabled={exportMode === 'current' ? filteredSolutions.length === 0 : Object.keys(workshops).length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>CSV出力</span>
            </button>
          </div>
        </div>
      </div>

      {/* データ一覧 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">アイデア一覧</h3>
          <div className="text-sm text-gray-500">
            {filteredSolutions.length > 0 && (
              <>
                表示中: {filteredSolutions.length}件 / 全{solutions.length}件
              </>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredSolutions.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {solutions.length === 0 ? 'まだアイデアが投稿されていません' : '条件に合うアイデアが見つかりません'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投稿日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    課題
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    グループ名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    お名前
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    What（どんな課題か）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Why（なぜ重要か）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    How（どう解決するか）
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSolutions.map((solution, index) => {
                  // ソリューションテキストを解析してWhat/Why/Howを抽出
                  const whatMatch = solution.solution.match(/【What（どんな課題か）】\n([\s\S]*?)\n\n【Why/);
                  const whyMatch = solution.solution.match(/【Why（なぜ重要か）】\n([\s\S]*?)\n\n【How/);
                  const howMatch = solution.solution.match(/【How（どう解決するか）】\n([\s\S]*?)$/);
                  
                  const what = whatMatch ? whatMatch[1].trim() : solution.solution;
                  const why = whyMatch ? whyMatch[1].trim() : '';
                  const how = howMatch ? howMatch[1].trim() : '';

                  return (
                    <tr key={solution.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solution.timestamp}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={solution.challenge}>
                          {solution.challenge}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {solution.groupName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solution.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md">
                          <div className="truncate" title={what}>
                            {what.length > 50 ? `${what.substring(0, 50)}...` : what}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {what.length} 文字
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md">
                          <div className="truncate" title={why}>
                            {why.length > 50 ? `${why.substring(0, 50)}...` : why}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {why.length} 文字
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md">
                          <div className="truncate" title={how}>
                            {how.length > 50 ? `${how.substring(0, 50)}...` : how}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {how.length} 文字
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const SolutionManagementSystem = () => {
  const { solutions, activeChallenges, setActiveChallenges, customChallenges, setCustomChallenges, allChallenges, workshops, setWorkshops, currentWorkshopId, setCurrentWorkshopId, currentWorkshop, createWorkshop, switchWorkshop, setSolutions } = useAppContext();
  
  const [currentView, setCurrentView] = useState('select');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [newChallengeText, setNewChallengeText] = useState('');
  const [adminSubView, setAdminSubView] = useState('workshop'); // 'workshop', 'challenges', or 'data'
  const [newWorkshopName, setNewWorkshopName] = useState('');

  const getAllChallenges = useCallback(() => {
    return [...allChallenges, ...customChallenges];
  }, [allChallenges, customChallenges]);

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    setCurrentView('select');
    setAdminSubView('workshop'); // 管理者画面のタブもリセット
  }, []);

  const toggleChallengeActive = useCallback((challenge) => {
    setActiveChallenges(prev => 
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  }, [setActiveChallenges]);

  const addCustomChallenge = useCallback(() => {
    const trimmedText = newChallengeText.trim();
    const allCurrentChallenges = getAllChallenges();
    
    if (trimmedText && !allCurrentChallenges.includes(trimmedText)) {
      setCustomChallenges(prev => [...prev, trimmedText]);
      setNewChallengeText('');
    } else if (allCurrentChallenges.includes(trimmedText)) {
      alert('この課題は既に存在します');
      setNewChallengeText('');
    } else {
      alert('課題名を入力してください');
    }
  }, [newChallengeText, getAllChallenges, setCustomChallenges]);

  const deleteCustomChallenge = useCallback((challengeToDelete) => {
    if (customChallenges.includes(challengeToDelete)) {
      setCustomChallenges(prev => prev.filter(c => c !== challengeToDelete));
      setActiveChallenges(prev => prev.filter(c => c !== challengeToDelete));
    }
  }, [customChallenges, setCustomChallenges, setActiveChallenges]);

  const handleCreateWorkshop = useCallback(() => {
    if (newWorkshopName.trim()) {
      createWorkshop(newWorkshopName.trim());
      setNewWorkshopName('');
      alert(`ワークショップ「${newWorkshopName}」を作成しました`);
    } else {
      alert('ワークショップ名を入力してください');
    }
  }, [newWorkshopName, createWorkshop]);

  const deleteWorkshop = useCallback((workshopId) => {
    if (window.confirm('このワークショップを削除してもよろしいですか？\nすべてのデータが失われます。')) {
      setWorkshops(prev => {
        const newWorkshops = { ...prev };
        delete newWorkshops[workshopId];
        return newWorkshops;
      });
      
      // 削除したワークショップが現在選択中の場合
      if (currentWorkshopId === workshopId) {
        setCurrentWorkshopId(null);
        setSolutions([]);
        setActiveChallenges([]);
        setCustomChallenges([]);
      }
    }
  }, [currentWorkshopId]);

  const getChallengeStats = useCallback(() => {
    const stats = {};
    solutions.forEach(sol => {
      stats[sol.challenge] = (stats[sol.challenge] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [solutions]);

  const getGroupStats = useCallback(() => {
    const stats = {};
    solutions.forEach(sol => {
      stats[sol.groupName] = (stats[sol.groupName] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1]);
  }, [solutions]);

  // 🏠 選択画面
  if (currentView === 'select') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-12">
            {/* Alumnoteロゴとタイトル */}
            <div className="mb-8 flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                {/* Alumnoteの公式ロゴ */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="#4f46e5" />
                  <circle cx="50" cy="50" r="25" fill="white" />
                  <circle cx="50" cy="50" r="15" fill="#4f46e5" />
                </svg>
              </div>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">alumnote</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Idea Campus
              </h1>
              <p className="text-lg text-gray-600 font-normal">
                革新的なアイデアを生み出そう
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setCurrentView('adminAuth')}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-medium">管理者</div>
                    <div className="text-sm opacity-90 font-normal">ワークショップ・課題管理</div>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 transform rotate-180" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('student')}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-medium">学生</div>
                    <div className="text-sm opacity-90 font-normal">アイデアを投稿</div>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 transform rotate-180" />
              </div>
            </button>
            
            <button
              onClick={() => setCurrentView('presenter')}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-medium">ダッシュボード</div>
                    <div className="text-sm opacity-90 font-normal">リアルタイム表示</div>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 transform rotate-180" />
              </div>
            </button>
          </div>
          
          {/* フッター */}
          <div className="mt-12 text-center text-sm text-gray-500">
            powered by alumnote
          </div>
        </div>
      </div>
    );
  }

  // 🔐 管理者認証画面
  if (currentView === 'adminAuth') {
    return (
      <AdminAuth
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setCurrentView('admin');
        }}
        onCancel={() => setCurrentView('select')}
      />
    );
  }

  // 👑 管理者画面
  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-light">ログアウト</span>
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-light text-gray-900 tracking-tight">
                  管理者画面
                </h1>
                <p className="text-gray-500 text-sm">課題管理・データ分析</p>
              </div>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        {/* タブメニュー */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setAdminSubView('workshop')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  adminSubView === 'workshop'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>ワークショップ管理</span>
                </div>
              </button>
              <button
                onClick={() => setAdminSubView('challenges')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  adminSubView === 'challenges'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>課題管理</span>
                </div>
              </button>
              <button
                onClick={() => setAdminSubView('data')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  adminSubView === 'data'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>データ管理</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          {adminSubView === 'workshop' ? (
            // ワークショップ管理タブ
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">ワークショップ管理</h2>
                  <p className="text-gray-500">
                    {currentWorkshop ? (
                      <>現在のワークショップ: <span className="font-medium text-indigo-600">{currentWorkshop.name}</span></>
                    ) : (
                      'ワークショップが選択されていません'
                    )}
                  </p>
                </div>

                {/* 新規ワークショップ作成 */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">新しいワークショップを作成</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newWorkshopName}
                      onChange={(e) => setNewWorkshopName(e.target.value)}
                      placeholder="例: 2024年春季ワークショップ"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateWorkshop();
                        }
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                    />
                    <button
                      onClick={handleCreateWorkshop}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>作成</span>
                    </button>
                  </div>
                </div>

                {/* ワークショップ一覧 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ワークショップ一覧</h3>
                  {Object.keys(workshops).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">まだワークショップが作成されていません</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(workshops).map(([id, workshop]) => {
                        const isActive = currentWorkshopId === id;
                        return (
                          <div
                            key={id}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                              isActive 
                                ? 'border-indigo-600 bg-indigo-50' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {!isActive && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteWorkshop(id);
                                }}
                                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                                style={{ zIndex: 20 }}
                                aria-label="ワークショップを削除"
                              >
                                <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                            
                            <div className="mb-4">
                              <h4 className={`font-medium text-lg ${isActive ? 'text-indigo-600' : 'text-gray-900'}`}>
                                {workshop.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                作成日: {new Date(workshop.createdAt).toLocaleDateString('ja-JP')}
                              </p>
                              {isActive && (
                                <span className="inline-block mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full">
                                  現在選択中
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{workshop.solutions.length}</div>
                                <div className="text-xs text-gray-500">アイデア</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{workshop.activeChallenges.length}</div>
                                <div className="text-xs text-gray-500">課題</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  {new Set(workshop.solutions.map(s => s.groupName)).size}
                                </div>
                                <div className="text-xs text-gray-500">グループ</div>
                              </div>
                            </div>
                            
                            {!isActive && (
                              <button
                                onClick={() => switchWorkshop(id)}
                                className="relative w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                                style={{ zIndex: 10 }}
                              >
                                このワークショップを選択
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : adminSubView === 'challenges' ? (
            // 課題管理タブ
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">アクティブな課題</h2>
                  <p className="text-gray-500">現在学生に表示されている課題: <span className="font-medium">{activeChallenges.length}個</span></p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">新しい課題を追加</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newChallengeText}
                    onChange={(e) => setNewChallengeText(e.target.value)}
                    placeholder="新しい課題を入力してください"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCustomChallenge();
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <button
                    onClick={addCustomChallenge}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>追加</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-6">課題一覧</h3>
                
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    デフォルト課題
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allChallenges.map((challenge, index) => {
                      const isActive = activeChallenges.includes(challenge);
                      return (
                        <button
                          key={index}
                          onClick={() => toggleChallengeActive(challenge)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                            isActive 
                              ? 'border-blue-500 bg-blue-50 text-blue-900' 
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{challenge}</span>
                            {isActive ? (
                              <Eye className="w-5 h-5 text-blue-500" />
                            ) : (
                              <EyeOff className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {customChallenges.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      追加された課題
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customChallenges.map((challenge, index) => {
                        const isActive = activeChallenges.includes(challenge);
                        return (
                          <div
                            key={`custom-${index}`}
                            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                              isActive 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-medium ${isActive ? 'text-green-900' : 'text-gray-700'}`}>
                                {challenge}
                              </span>
                              <button
                                onClick={() => deleteCustomChallenge(challenge)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                title="課題を削除"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <button
                              onClick={() => toggleChallengeActive(challenge)}
                              className={`w-full py-2 px-3 rounded-lg transition-colors text-sm ${
                                isActive
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              {isActive ? (
                                <span className="flex items-center justify-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>表示中</span>
                                </span>
                              ) : (
                                <span className="flex items-center justify-center space-x-1">
                                  <EyeOff className="w-4 h-4" />
                                  <span>非表示</span>
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // データ管理タブ
            <DataManagement />
          )}
        </div>
      </div>
    );
  }

  // 🎓 学生画面
  if (currentView === 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('select')}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-light">戻る</span>
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-light text-gray-900 tracking-tight">
                  新しいアイデア
                </h1>
              </div>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">{solutions.length}</h3>
              <p className="text-gray-500 font-light">投稿されたアイデア</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <StudentForm />
          </div>
        </div>
      </div>
    );
  }

  // 📊 プレゼンター画面
  if (currentView === 'presenter') {
    const challengeStats = getChallengeStats();
    const groupStats = getGroupStats();

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('select')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-light">戻る</span>
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-light tracking-tight">
                  Ideas Dashboard
                </h1>
                <p className="text-gray-400 font-light mt-1">
                  {currentWorkshop ? currentWorkshop.name : 'ワークショップ未選択'}
                </p>
              </div>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900 rounded-3xl p-8 text-center border border-gray-800">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-light mb-3">{solutions.length}</h3>
              <p className="text-gray-400 font-light text-lg">総アイデア数</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 text-center border border-gray-800">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-light mb-3">{challengeStats.length}</h3>
              <p className="text-gray-400 font-light text-lg">活発な課題</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 text-center border border-gray-800">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-5xl font-light mb-3">{groupStats.length}</h3>
              <p className="text-gray-400 font-light text-lg">参加チーム</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <h2 className="text-3xl font-light mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mr-4 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                人気の課題
              </h2>
              
              {challengeStats.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-xl font-light">最初のアイデアを待っています</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challengeStats.map(([challengeName, count], index) => {
                    const maxCount = Math.max(...challengeStats.map(s => s[1]));
                    const width = (count / maxCount) * 100;
                    const colors = [
                      'from-yellow-400 to-orange-500',
                      'from-gray-400 to-gray-500', 
                      'from-orange-400 to-red-500',
                      'from-blue-400 to-purple-500',
                      'from-green-400 to-blue-500'
                    ];
                    
                    return (
                      <div key={challengeName} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${colors[index]} flex-shrink-0`}>
                              {index + 1}
                            </div>
                            <span className="text-white font-light text-lg truncate">
                              {challengeName.length > 20 ? `${challengeName.substring(0, 20)}...` : challengeName}
                            </span>
                          </div>
                          <div className="text-white font-bold text-2xl ml-4 flex-shrink-0">
                            {count}
                          </div>
                        </div>
                        
                        <div className="relative ml-0">
                          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-2000 ease-out rounded-full flex items-center justify-end pr-2`}
                              style={{ width: `${width}%` }}
                            >
                              {width > 25 && (
                                <span className="text-white text-xs font-bold">
                                  {count}個
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex mt-3 space-x-1 overflow-hidden">
                            {Array.from({length: count}, (_, i) => (
                              <div 
                                key={i}
                                className={`w-3 h-8 bg-gradient-to-t ${colors[index]} rounded-sm transition-all duration-300`}
                                style={{ 
                                  animationDelay: `${i * 200}ms`,
                                  transform: 'translateY(0)'
                                }}
                              />
                            )).slice(0, 15)}
                            {count > 15 && (
                              <div className="flex items-center justify-center w-10 h-8 bg-gray-700 rounded-sm text-white text-xs font-medium">
                                +{count - 15}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <h2 className="text-3xl font-light mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mr-4 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                チームランキング
              </h2>
              
              {groupStats.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-xl font-light">チームの参加を待っています</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupStats.map(([groupName, count], index) => {
                    const maxCount = Math.max(...groupStats.map(s => s[1]));
                    const normalizedHeight = (count / maxCount) * 150 + 40;
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
                    const gradients = [
                      'from-green-400 to-green-600',
                      'from-blue-400 to-blue-600', 
                      'from-purple-400 to-purple-600',
                      'from-yellow-400 to-yellow-600',
                      'from-red-400 to-red-600'
                    ];
                    
                    return (
                      <div key={groupName} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${gradients[index % gradients.length]} flex-shrink-0`}>
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-white font-light text-xl block truncate">{groupName}</span>
                              <div className="text-gray-400 text-sm">{count}個のアイデア</div>
                            </div>
                          </div>
                          <div className="text-white font-bold text-3xl ml-4 flex-shrink-0">
                            {count}
                          </div>
                        </div>
                        
                        <div className="flex justify-center py-2">
                          <div className="relative flex flex-col items-center">
                            <div 
                              className={`w-16 bg-gradient-to-t ${gradients[index % gradients.length]} rounded-t-2xl transition-all duration-2000 ease-out flex flex-col items-center justify-end relative overflow-hidden shadow-lg`}
                              style={{ height: `${Math.max(normalizedHeight, 60)}px` }}
                            >
                              <div className="absolute bottom-0 w-full flex flex-col justify-end">
                                {Array.from({length: Math.min(count, 8)}, (_, i) => (
                                  <div 
                                    key={i}
                                    className="w-full h-3 bg-white bg-opacity-20 border-b border-white border-opacity-30 transition-all duration-300"
                                    style={{ 
                                      animationDelay: `${i * 300}ms`,
                                      transform: 'translateY(0)'
                                    }}
                                  />
                                )).reverse()}
                              </div>
                              
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg z-10 drop-shadow-lg">
                                {count}
                              </div>
                            </div>
                            
                            <div className={`w-20 h-4 ${colors[index % colors.length]} rounded-b-xl -mt-1 shadow-md`}></div>
                            
                            <div className="text-center mt-3 w-20">
                              <span className="text-white text-sm font-light block truncate px-1">
                                {groupName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// 🌍 アプリケーションのルート
const App = () => {
  return (
    <AppProvider>
      <SolutionManagementSystem />
    </AppProvider>
  );
};

export default App;