import { AppLocale, ExpenseCategory } from '../types/expense';

export const TRANSLATIONS = {
  es: {
    // Header
    appName: 'VOUT Pocket',
    appTagline: 'Control de Gastos, Subs & Microgastos',
    notifications: 'Alertas',
    savingsStreak: 'Racha de Ahorro',

    // Dashboard Hero Card
    remainingBalance: 'Saldo Disponible',
    monthlyIncome: 'Ingreso Mensual',
    totalCommitted: 'Total Comprometido',
    spentSoFar: 'Gastado hasta hoy',
    safeToSpend: 'Libre para gastar',
    healthyStatus: 'EQUILIBRADO',
    warningStatus: 'ALERTA DE GASTO',
    usedOfIncome: 'del ingreso utilizado',

    // 4 Action Buttons in Hero Card
    addExpenseAction: '+ Gasto',
    subsAction: 'Subs',
    fixedAction: 'Fijos',
    editIncomeAction: 'Ingreso',

    // Sections
    upcomingSubs: 'Suscripciones & Vencimientos',
    recentExpenses: 'Gastos & Microgastos',
    viewAll: 'Ver todos >',
    today: 'Hoy',
    noExpensesTitle: 'Sin gastos registrados',
    noExpensesDesc: 'Tocá el botón (+) para registrar tu primer gasto o microgasto.',

    // Categories
    all: 'Todos',
    fixed: 'Fijos',
    subscription: 'Suscripciones',
    leisure: 'Salidas y Ocio',
    micro: 'Microgastos',

    // Statuses
    paid: 'Pagado',
    pending: 'Pendiente',
    dueDay: (day: number) => `Vence día ${day}`,

    // Screen 2: Quick Expense Entry
    recordExpenseTitle: 'Registrar Gasto',
    budgetImpact: 'Impacto en Presupuesto',
    balanceAfterExpense: 'Saldo restante estimado',
    budgetUtilization: 'Porcentaje del presupuesto mensual',
    quickPickLabel: 'Categoría Rápida / Concepto',
    holdToSave: 'Mantené presionado para Registrar',
    expenseSavedTitle: '¡Gasto Registrado!',
    expenseSavedMsg: (amount: string, title: string) => `Se registró ${amount} en ${title}`,
    amountMustBeGreaterThanZero: 'Ingresá un monto mayor a 0',

    // Screen 3: Subscriptions
    subsScreenTitle: 'Suscripciones & Servicios',
    activeSubsTitle: 'Compromisos Recurrentes',
    monthlyRecurringTotal: 'Total mensual en servicios',
    nextDueLabel: 'Próximo vencimiento',
    quickActions: 'Acciones Rápidas',
    markAllPaid: 'Pagar Todo',
    viewSummary: 'Resumen',
    savingsGoalAction: 'Meta Ahorro',
    pauseSubsAction: 'Pausar',
    addSubscriptionBtn: '+ Agregar Suscripción / Fijo',

    // Edit Income Modal
    editIncomeTitle: 'Modificar Ingreso Mensual',
    editIncomeDesc: 'Ingresá tu ingreso neto mensual para calcular tu saldo disponible:',
    savingsGoalLabel: 'Meta de ahorro del mes',
    saveIncomeBtn: 'Guardar Presupuesto',

    // Preferences Modal (El cuadro de preferencias)
    preferencesTitle: 'Preferencias de Interfaz',
    personalizationSubtitle: 'Personalización & Aspecto',
    preferencesDesc: 'Personalizá el modo de pantalla, el color de acento, el idioma y la moneda.',
    screenMode: 'Modo de Pantalla',
    light: 'Claro',
    dark: 'Oscuro',
    accentColor: 'Color de Acento',
    language: 'Idioma',
    currency: 'Moneda',
    legalSection: 'Legal & Privacidad',
    termsOfService: 'Términos y Condiciones',
    privacyPolicy: 'Política de Privacidad',
    cookiePolicy: 'Política de Cookies',
    appVersion: 'Versión de la App',
    close: 'Cerrar',
    apply: 'Aplicar',

    // Updates & Shake Gesture
    updatesSection: 'Actualizaciones del Sistema (OTA)',
    checkForUpdates: 'Buscar y aplicar actualización',
    shakeToUpdateTitle: 'Agitar para actualizar',
    shakeToUpdateDesc: 'Agitá tu celular en cualquier pantalla para buscar e instalar actualizaciones al instante.',
    shakeDetectedTitle: '¡Sacudida detectada!',
    manualUpdateTitle: 'Actualización del Sistema',
    checkingUpdates: 'Comprobando si hay una nueva versión...',
    downloadingUpdate: '¡Nueva versión encontrada! Descargando paquete...',
    updateReady: '¡Actualización descargada! Reiniciando la app...',
    upToDate: 'Tu aplicación ya cuenta con la última versión disponible.',
    updateError: 'No se pudo conectar con el servidor de actualizaciones o estás en modo desarrollo.',
    restartNow: 'Reiniciar Ahora',
    shakeSensitivity: 'Sensibilidad de Sacudida',
    sensitivityFirm: 'Firme (Enérgica)',
    sensitivityMedium: 'Media',
    sensitivityGentle: 'Suave',
    sensitivityDesc: 'Firme requiere sacudir con fuerza de ida y vuelta para evitar disparos por error.',

    // Navigation
    homeTab: 'Resumen',
    subsTab: 'Suscripciones',
    historyTab: 'Historial',
    searchTab: 'Buscar',

    // General
    cancel: 'Cancelar',
    save: 'Guardar',
    confirm: 'Confirmar',
    deleteAction: 'Eliminar',
    searchPlaceholder: 'Buscar café, Netflix, alquiler, salidas...',
    newExpense: 'Nuevo Gasto',
    categoryLabel: 'Categoría',
    titleLabel: 'Concepto / Nombre',
    amountLabel: 'Monto',
    dueDateLabel: 'Día de vencimiento (1 - 31)',
    isPaidLabel: 'Marcar como pagado ya',
    saveIncome: 'Guardar Ingreso',
  },

  en: {
    // Header
    appName: 'VOUT Pocket',
    appTagline: 'Expenses, Subs & Micro-spending',
    notifications: 'Alerts',
    savingsStreak: 'Savings Streak',

    // Dashboard Hero Card
    remainingBalance: 'Disposable Balance',
    monthlyIncome: 'Monthly Income',
    totalCommitted: 'Total Committed',
    spentSoFar: 'Spent so far',
    safeToSpend: 'Safe to spend',
    healthyStatus: 'HEALTHY',
    warningStatus: 'HIGH SPEND',
    usedOfIncome: 'of monthly income used',

    // 4 Action Buttons in Hero Card
    addExpenseAction: '+ Expense',
    subsAction: 'Subs',
    fixedAction: 'Fixed Bills',
    editIncomeAction: 'Income',

    // Sections
    upcomingSubs: 'Subscriptions & Due Dates',
    recentExpenses: 'Expenses & Micro-spending',
    viewAll: 'View all >',
    today: 'Today',
    noExpensesTitle: 'No expenses yet',
    noExpensesDesc: 'Tap the (+) button to log your first expense or micro-spend.',

    // Categories
    all: 'All',
    fixed: 'Fixed',
    subscription: 'Subscriptions',
    leisure: 'Leisure',
    micro: 'Micro-spends',

    // Statuses
    paid: 'Paid',
    pending: 'Pending',
    dueDay: (day: number) => `Due on day ${day}`,

    // Screen 2: Quick Expense Entry
    recordExpenseTitle: 'Record Expense',
    budgetImpact: 'Budget Impact',
    balanceAfterExpense: 'Estimated remaining balance',
    budgetUtilization: 'Monthly budget utilization percentage',
    quickPickLabel: 'Quick Category / Item',
    holdToSave: 'Hold To Save Expense',
    expenseSavedTitle: 'Expense Saved!',
    expenseSavedMsg: (amount: string, title: string) => `Logged ${amount} for ${title}`,
    amountMustBeGreaterThanZero: 'Please enter an amount greater than 0',

    // Screen 3: Subscriptions
    subsScreenTitle: 'Subscriptions & Bills',
    activeSubsTitle: 'Recurring Commitments',
    monthlyRecurringTotal: 'Total monthly recurring bills',
    nextDueLabel: 'Next due date',
    quickActions: 'Quick Actions',
    markAllPaid: 'Mark All Paid',
    viewSummary: 'Summary',
    savingsGoalAction: 'Savings Goal',
    pauseSubsAction: 'Pause',
    addSubscriptionBtn: '+ Add Subscription / Bill',

    // Edit Income Modal
    editIncomeTitle: 'Edit Monthly Income',
    editIncomeDesc: 'Enter your monthly net income to calculate your safe disposable balance:',
    savingsGoalLabel: 'Monthly savings goal',
    saveIncomeBtn: 'Save Budget',

    // Preferences Modal
    preferencesTitle: 'Interface Preferences',
    personalizationSubtitle: 'Personalization & Appearance',
    preferencesDesc: 'Customize display mode, accent palette, language, and currency.',
    screenMode: 'Display Mode',
    light: 'Light',
    dark: 'Dark',
    accentColor: 'Accent Color',
    language: 'Language',
    currency: 'Currency',
    legalSection: 'Legal & Privacy',
    termsOfService: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    appVersion: 'App Version',
    close: 'Close',
    apply: 'Apply',

    // Updates & Shake Gesture
    updatesSection: 'System Updates (OTA)',
    checkForUpdates: 'Check & apply update',
    shakeToUpdateTitle: 'Shake to update',
    shakeToUpdateDesc: 'Shake your device anywhere to check for and install updates instantly.',
    shakeDetectedTitle: 'Shake detected!',
    manualUpdateTitle: 'System Update',
    checkingUpdates: 'Checking for new releases...',
    downloadingUpdate: 'New release found! Downloading update bundle...',
    updateReady: 'Update downloaded! Restarting app...',
    upToDate: 'Your app is already running the latest version.',
    updateError: 'Could not connect to update server or running in dev mode.',
    restartNow: 'Restart Now',
    shakeSensitivity: 'Shake Sensitivity',
    sensitivityFirm: 'Firm (Vigorous)',
    sensitivityMedium: 'Medium',
    sensitivityGentle: 'Gentle',
    sensitivityDesc: 'Firm requires repeated vigorous shaking to avoid accidental triggers while walking.',

    // Navigation
    homeTab: 'Overview',
    subsTab: 'Subscriptions',
    historyTab: 'History',
    searchTab: 'Search',

    // General
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    deleteAction: 'Delete',
    searchPlaceholder: 'Search coffee, Netflix, rent, snacks...',
    newExpense: 'New Expense',
    categoryLabel: 'Category',
    titleLabel: 'Expense Title / Name',
    amountLabel: 'Amount',
    dueDateLabel: 'Due Day of Month (1 - 31)',
    isPaidLabel: 'Mark as already paid',
    saveIncome: 'Save Income',
  },

  pt: {
    // Header
    appName: 'VOUT Pocket',
    appTagline: 'Gastos, Assinaturas e Microgastos',
    notifications: 'Alertas',
    savingsStreak: 'Sequência de Economia',

    // Dashboard Hero Card
    remainingBalance: 'Saldo Disponível',
    monthlyIncome: 'Renda Mensal',
    totalCommitted: 'Total Comprometido',
    spentSoFar: 'Gasto até agora',
    safeToSpend: 'Livre para gastar',
    healthyStatus: 'EQUILIBRADO',
    warningStatus: 'ALERTA',
    usedOfIncome: 'da renda utilizada',

    // 4 Action Buttons in Hero Card
    addExpenseAction: '+ Gasto',
    subsAction: 'Subs',
    fixedAction: 'Fixos',
    editIncomeAction: 'Renda',

    // Sections
    upcomingSubs: 'Assinaturas & Vencimentos',
    recentExpenses: 'Gastos & Microgastos',
    viewAll: 'Ver todos >',
    today: 'Hoje',
    noExpensesTitle: 'Nenhum gasto ainda',
    noExpensesDesc: 'Toque no botão (+) para registrar seu primeiro gasto.',

    // Categories
    all: 'Todos',
    fixed: 'Fixos',
    subscription: 'Assinaturas',
    leisure: 'Lazer',
    micro: 'Microgastos',

    // Statuses
    paid: 'Pago',
    pending: 'Pendente',
    dueDay: (day: number) => `Vence dia ${day}`,

    // Screen 2: Quick Expense Entry
    recordExpenseTitle: 'Registrar Gasto',
    budgetImpact: 'Impacto no Orçamento',
    balanceAfterExpense: 'Saldo restante estimado',
    budgetUtilization: 'Porcentagem do orçamento mensal',
    quickPickLabel: 'Categoria Rápida',
    holdToSave: 'Pressione para Salvar',
    expenseSavedTitle: 'Gasto Registrado!',
    expenseSavedMsg: (amount: string, title: string) => `Registrado ${amount} em ${title}`,
    amountMustBeGreaterThanZero: 'Digite um valor maior que 0',

    // Screen 3: Subscriptions
    subsScreenTitle: 'Assinaturas & Contas',
    activeSubsTitle: 'Compromissos Recorrentes',
    monthlyRecurringTotal: 'Total mensal de assinaturas',
    nextDueLabel: 'Próximo vencimento',
    quickActions: 'Ações Rápidas',
    markAllPaid: 'Pagar Tudo',
    viewSummary: 'Resumo',
    savingsGoalAction: 'Meta Economia',
    pauseSubsAction: 'Pausar',
    addSubscriptionBtn: '+ Adicionar Assinatura',

    // Edit Income Modal
    editIncomeTitle: 'Modificar Renda Mensal',
    editIncomeDesc: 'Informe sua renda líquida mensal para calcular o saldo disponível:',
    savingsGoalLabel: 'Meta de economia do mês',
    saveIncomeBtn: 'Salvar Orçamento',

    // Preferences Modal
    preferencesTitle: 'Preferências de Interface',
    personalizationSubtitle: 'Personalização & Aparência',
    preferencesDesc: 'Personalize o modo de tela, cor de destaque, idioma e moeda.',
    screenMode: 'Modo de Tela',
    light: 'Claro',
    dark: 'Escuro',
    accentColor: 'Cor de Destaque',
    language: 'Idioma',
    currency: 'Moeda',
    legalSection: 'Legal & Privacidade',
    termsOfService: 'Termos e Condições',
    privacyPolicy: 'Política de Privacidade',
    cookiePolicy: 'Política de Cookies',
    appVersion: 'Versão do App',
    close: 'Fechar',
    apply: 'Aplicar',

    // Updates & Shake Gesture
    updatesSection: 'Atualizações do Sistema (OTA)',
    checkForUpdates: 'Buscar e aplicar atualização',
    shakeToUpdateTitle: 'Agitar para atualizar',
    shakeToUpdateDesc: 'Agite o celular em qualquer tela para buscar e instalar atualizações instantaneamente.',
    shakeDetectedTitle: 'Agitação detectada!',
    manualUpdateTitle: 'Atualização do Sistema',
    checkingUpdates: 'Verificando novas versões...',
    downloadingUpdate: 'Nova versão encontrada! Baixando atualização...',
    updateReady: 'Atualização baixada! Reiniciando o app...',
    upToDate: 'Seu app já está atualizado com a versão mais recente.',
    updateError: 'Não foi possível conectar ao servidor ou você está em modo dev.',
    restartNow: 'Reiniciar Agora',
    shakeSensitivity: 'Sensibilidade do Gesto',
    sensitivityFirm: 'Firme (Enérgica)',
    sensitivityMedium: 'Média',
    sensitivityGentle: 'Suave',
    sensitivityDesc: 'Firme requer sacudir com força repetidas vezes para evitar acionamentos acidentais.',

    // Navigation
    homeTab: 'Resumo',
    subsTab: 'Assinaturas',
    historyTab: 'Histórico',
    searchTab: 'Buscar',

    // General
    cancel: 'Cancelar',
    save: 'Salvar',
    confirm: 'Confirmar',
    deleteAction: 'Excluir',
    searchPlaceholder: 'Buscar café, Netflix, aluguel, lanche...',
    newExpense: 'Novo Gasto',
    categoryLabel: 'Categoria',
    titleLabel: 'Nome do Gasto',
    amountLabel: 'Valor',
    dueDateLabel: 'Dia de Vencimento',
    isPaidLabel: 'Marcar como pago já',
    saveIncome: 'Salvar Renda',
  },

  zh: {
    // Header
    appName: 'VOUT Pocket',
    appTagline: '开支、订阅与微支出管理',
    notifications: '通知提醒',
    savingsStreak: '存钱打卡',

    // Dashboard Hero Card
    remainingBalance: '可用余额',
    monthlyIncome: '月度收入',
    totalCommitted: '承诺总支出',
    spentSoFar: '本月已支出',
    safeToSpend: '自由支配',
    healthyStatus: '预算健康',
    warningStatus: '预算预警',
    usedOfIncome: '收入支出占比',

    // 4 Action Buttons in Hero Card
    addExpenseAction: '+ 记一笔',
    subsAction: '订阅服务',
    fixedAction: '固定开销',
    editIncomeAction: '收入设定',

    // Sections
    upcomingSubs: '即将到期订阅与账单',
    recentExpenses: '近期开支与微支出',
    viewAll: '查看全部 >',
    today: '今天',
    noExpensesTitle: '暂无开销记录',
    noExpensesDesc: '点击下方 (+) 按钮记录您的第一笔微开支。',

    // Categories
    all: '全部',
    fixed: '固定开销',
    subscription: '订阅服务',
    leisure: '娱乐餐饮',
    micro: '日常微支出',

    // Statuses
    paid: '已结清',
    pending: '待支付',
    dueDay: (day: number) => `每月 ${day} 日到期`,

    // Screen 2: Quick Expense Entry
    recordExpenseTitle: '记录支出',
    budgetImpact: '预算余额影响',
    balanceAfterExpense: '预计剩余可用资金',
    budgetUtilization: '月度预算占用比例',
    quickPickLabel: '快捷分类 / 标签',
    holdToSave: '长按保存支出记录',
    expenseSavedTitle: '记录成功！',
    expenseSavedMsg: (amount: string, title: string) => `已记录 ${title} 支出 ${amount}`,
    amountMustBeGreaterThanZero: '请输入大于0的金额',

    // Screen 3: Subscriptions
    subsScreenTitle: '定期订阅与固定开支',
    activeSubsTitle: '周期性经常支出',
    monthlyRecurringTotal: '每月订阅总费用',
    nextDueLabel: '下一个到期日',
    quickActions: '快捷操作',
    markAllPaid: '全部标记为已付',
    viewSummary: '支出概览',
    savingsGoalAction: '储蓄目标',
    pauseSubsAction: '暂停服务',
    addSubscriptionBtn: '+ 添加定期订阅',

    // Edit Income Modal
    editIncomeTitle: '设置月度净收入',
    editIncomeDesc: '输入您每月的净收入以计算自由可支配余额：',
    savingsGoalLabel: '月度储蓄目标',
    saveIncomeBtn: '保存预算设置',

    // Preferences Modal
    preferencesTitle: '界面与语言偏好',
    personalizationSubtitle: '个性化与外观设置',
    preferencesDesc: '自定义显示模式、主题高亮色、系统语言和首选货币。',
    screenMode: '显示模式',
    light: '浅色',
    dark: '深色',
    accentColor: '高亮主题色',
    language: '语言设置',
    currency: '货币单位',
    legalSection: '法律与隐私条例',
    termsOfService: '服务条款与协议',
    privacyPolicy: '隐私保护政策',
    cookiePolicy: 'Cookie 与本地存储政策',
    appVersion: '应用程序版本',
    close: '关闭',
    apply: '保存应用',

    // Updates & Shake Gesture
    updatesSection: '系统热更新 (OTA)',
    checkForUpdates: '检查并安装更新',
    shakeToUpdateTitle: '摇一摇检查更新',
    shakeToUpdateDesc: '在任意页面摇晃手机即可立即检查并安装最新版本。',
    shakeDetectedTitle: '检测到摇一摇手势！',
    manualUpdateTitle: '系统更新',
    checkingUpdates: '正在检查服务器是否有新版本...',
    downloadingUpdate: '发现新版本！正在下载安装包...',
    updateReady: '新版本已下载完毕！正在重启应用...',
    upToDate: '您的应用程序已经是最新版本。',
    updateError: '无法连接到更新服务器或当前处于开发模式。',
    restartNow: '立即重启',
    shakeSensitivity: '摇一摇灵敏度',
    sensitivityFirm: '强力（推荐）',
    sensitivityMedium: '中等',
    sensitivityGentle: '轻柔',
    sensitivityDesc: '强力模式需要连续用力晃动，彻底杜绝走路或拿手机时的误触。',

    // Navigation
    homeTab: '概览',
    subsTab: '订阅服务',
    historyTab: '历史账单',
    searchTab: '快速搜索',

    // General
    cancel: '取消',
    save: '保存',
    confirm: '确认',
    deleteAction: '删除',
    searchPlaceholder: '搜索咖啡、Netflix、房租、零食...',
    newExpense: '新增支出',
    categoryLabel: '分类',
    titleLabel: '支出名称',
    amountLabel: '金额',
    dueDateLabel: '到期日',
    isPaidLabel: '标记为已支付',
    saveIncome: '保存收入',
  },
};

export const LOCALES: { code: AppLocale; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export function getTranslations(locale: AppLocale = 'es') {
  return TRANSLATIONS[locale] || TRANSLATIONS.es;
}
