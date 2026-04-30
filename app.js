// 全局状态
let currentCategory = 'all';
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('pregnantFoodFavorites') || '[]');

// DOM元素
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const foodList = document.getElementById('foodList');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const categoryBtns = document.querySelectorAll('.category-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const detailModal = document.getElementById('detailModal');

// 初始化
function init() {
  renderRecipes();
  renderFoodList();
  bindEvents();
}

// 切换TAB
function switchTab(tab) {
  const homeContent = document.getElementById('homeContent');
  const categoryContent = document.getElementById('categoryContent');
  const recipeSection = document.getElementById('recipeList').parentElement;
  const categoryFilter = document.querySelector('.px-4.mt-4 .flex.gap-2');
  
  switch(tab) {
    case 'home':
      homeContent.classList.remove('hidden');
      categoryContent.classList.add('hidden');
      recipeSection.classList.remove('hidden');
      categoryFilter.classList.remove('hidden');
      renderFoodList();
      break;
    case 'category':
      homeContent.classList.add('hidden');
      categoryContent.classList.remove('hidden');
      recipeSection.classList.add('hidden');
      categoryFilter.classList.add('hidden');
      renderCategoryView();
      break;
    case 'favorite':
      homeContent.classList.remove('hidden');
      categoryContent.classList.add('hidden');
      recipeSection.classList.add('hidden');
      categoryFilter.classList.add('hidden');
      renderFavorites();
      break;
  }
}

// 渲染分类视图（按食材类别分组）
function renderCategoryView() {
  const categoryList = document.getElementById('categoryList');
  
  // 食材类别
  const categories = [
    { name: '🥬 蔬菜菌菇', icon: '🥬', filter: f => f.category === 'vegetable' },
    { name: '🍎 水果', icon: '🍎', filter: f => f.category === 'fruit' },
    { name: '🥩 肉禽蛋', icon: '🥩', filter: f => f.category === 'meat' },
    { name: '🦐 水产海鲜', icon: '🦐', filter: f => f.category === 'seafood' },
    { name: '🍚 五谷杂粮', icon: '🍚', filter: f => f.category === 'grain' },
    { name: '🥛 奶豆制品', icon: '🥛', filter: f => f.category === 'dairy' },
    { name: '🌰 坚果干果', icon: '🌰', filter: f => f.category === 'nut' },
    { name: '🍵 饮品零食', icon: '🍵', filter: f => f.category === 'snack' },
    { name: '💊 滋补药材', icon: '💊', filter: f => f.category === 'medicine' }
  ];
  
  categoryList.innerHTML = categories.map(cat => {
    const foods = foodDatabase.filter(cat.filter);
    if (foods.length === 0) return '';
    
    return `
      <div class="glass-card rounded-2xl p-4">
        <h3 class="font-bold text-primary mb-3">${cat.name} <span class="text-muted text-sm font-normal">(${foods.length})</span></h3>
        <div class="flex flex-wrap gap-2">
          ${foods.map(food => `
            <button onclick="showDetail('${food.name}')"
              class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
                ${food.level === 'recommend' ? 'btn-recommend' : 
                  food.level === 'caution' ? 'btn-caution' : 
                  'btn-avoid'}">
              ${food.icon} ${food.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// 渲染菜谱推荐
function renderRecipes() {
  const recipeList = document.getElementById('recipeList');
  const shuffled = [...recipeDatabase].sort(() => Math.random() - 0.5);
  const randomRecipes = shuffled.slice(0, 4);

  recipeList.innerHTML = randomRecipes.map(recipe => `
    <div class="glass-card rounded-xl p-3 cursor-pointer active:scale-98 transition-transform"
         onclick="showRecipeDetail(${recipe.id})">
      <div class="text-2xl mb-2 text-center">${recipe.icon}</div>
      <h3 class="font-medium text-primary text-sm text-center truncate">${recipe.name}</h3>
      <div class="flex flex-wrap justify-center gap-1 mt-1">
        ${recipe.effect.slice(0, 2).map(e => `<span class="text-xs px-1.5 py-0.5 btn-recommend rounded-full">${e}</span>`).join('')}
      </div>
      <p class="text-xs text-muted text-center mt-1">${recipe.suitable}</p>
    </div>
  `).join('');
}

// 刷新菜谱推荐
function refreshRecipes() {
  renderRecipes();
}

// 显示菜谱详情
function showRecipeDetail(id) {
  const recipe = recipeDatabase.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById('detailTitle').textContent = recipe.name;
  const tagEl = document.getElementById('detailTag');
  tagEl.className = 'inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium mb-4 bg-gradient-to-r from-pink-500 to-rose-500';
  tagEl.textContent = '🍳 孕妇菜谱';

  // 替换详情内容
  const detailContent = document.querySelector('#detailModal .px-4.pb-8');
  detailContent.innerHTML = `
    <div class="bg-gray-50 rounded-2xl p-4 mb-4">
      <h3 class="font-medium text-gray-700 mb-2">📝 简介</h3>
      <p class="text-gray-600 text-sm leading-relaxed">${recipe.desc}</p>
    </div>
    <div class="bg-green-50 rounded-2xl p-4 mb-4">
      <h3 class="font-medium text-green-700 mb-2">✨ 功效</h3>
      <div class="flex flex-wrap gap-2">
        ${recipe.effect.map(e => `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">${e}</span>`).join('')}
      </div>
    </div>
    <div class="bg-blue-50 rounded-2xl p-4 mb-4">
      <h3 class="font-medium text-blue-700 mb-2">💡 营养价值</h3>
      <p class="text-blue-600 text-sm leading-relaxed">${recipe.nutrition}</p>
    </div>
    <div class="bg-purple-50 rounded-2xl p-4 mb-4">
      <h3 class="font-medium text-purple-700 mb-2">🥗 食材</h3>
      <ul class="text-purple-600 text-sm leading-relaxed space-y-1">
        ${recipe.ingredients.map(i => `<li>• ${i}</li>`).join('')}
      </ul>
    </div>
    <div class="bg-amber-50 rounded-2xl p-4 mb-4">
      <h3 class="font-medium text-amber-700 mb-2">👨‍🍳 做法步骤</h3>
      <ol class="text-amber-600 text-sm leading-relaxed space-y-2">
        ${recipe.steps.map((s, i) => `<li><span class="font-bold">${i + 1}.</span> ${s}</li>`).join('')}
      </ol>
    </div>
    <div class="bg-rose-50 rounded-2xl p-4">
      <h3 class="font-medium text-rose-700 mb-2">💡 小贴士</h3>
      <p class="text-rose-600 text-sm leading-relaxed">${recipe.tips}</p>
    </div>
  `;

  // 恢复标题和关闭按钮结构
  const titleContainer = document.querySelector('#detailTitle').parentElement;
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'ml-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 favorite-btn';
  favoriteBtn.innerHTML = '🤍 收藏';
  titleContainer.appendChild(favoriteBtn);

  document.getElementById('detailModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// 绑定事件
function bindEvents() {
  // 搜索事件
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    updateClearButton();
    renderFoodList();
  });

  // 清除搜索
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    updateClearButton();
    renderFoodList();
  });

  // 分类按钮
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active', 'bg-gray-800', 'text-white'));
      btn.classList.add('active', 'bg-gray-800', 'text-white');
      currentCategory = btn.dataset.category;
      renderFoodList();
    });
  });

  // 底部导航
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active', 'text-pink-500'));
      btn.classList.add('active', 'text-pink-500');
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // 点击遮罩关闭详情
  detailModal.querySelector('.modal-overlay').addEventListener('click', closeDetail);
}

// 更新清除按钮显示状态
function updateClearButton() {
  if (searchQuery) {
    clearSearch.classList.remove('hidden');
  } else {
    clearSearch.classList.add('hidden');
  }
}

// 过滤食材
function filterFoods() {
  let filtered = foodDatabase;

  // 按分类筛选
  if (currentCategory !== 'all') {
    filtered = filtered.filter(food => food.level === currentCategory);
  }

  // 按搜索关键词筛选（支持多食材，用逗号、空格、顿号分隔）
  if (searchQuery) {
    const keywords = searchQuery.split(/[,，、\s]+/).filter(k => k.trim());
    if (keywords.length > 0) {
      filtered = filtered.filter(food =>
        keywords.some(keyword =>
          food.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }

  return filtered;
}

// 渲染食材列表
function renderFoodList() {
  const foods = filterFoods();

  // 多食材搜索汇总分析
  const keywords = searchQuery ? searchQuery.split(/[,，、\s]+/).filter(k => k.trim()) : [];
  const isMultiSearch = keywords.length > 1;
  
  // 分类统计
  const recommendCount = foods.filter(f => f.level === 'recommend').length;
  const cautionCount = foods.filter(f => f.level === 'caution').length;
  const avoidCount = foods.filter(f => f.level === 'avoid').length;

  // 更新统计
  if (isMultiSearch && foods.length > 0) {
    resultCount.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm text-primary">共搜索 ${keywords.length} 种食材，找到 ${foods.length} 个匹配</div>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-2 py-1 rounded-full btn-recommend">✅ 推荐 ${recommendCount} 种</span>
          <span class="px-2 py-1 rounded-full btn-caution">⚠️ 慎吃 ${cautionCount} 种</span>
          <span class="px-2 py-1 rounded-full btn-avoid">❌ 禁吃 ${avoidCount} 种</span>
        </div>
      </div>
    `;
  } else {
    resultCount.innerHTML = `共收录 <span class="font-bold text-primary">${foodDatabase.length}</span> 种食材，找到 ${foods.length} 个结果`;
  }

  // 空状态
  if (foods.length === 0) {
    foodList.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // 渲染列表
  foodList.innerHTML = foods.map(food => `
    <div class="glass-card rounded-2xl p-4 cursor-pointer active:scale-98 transition-transform"
         onclick="showDetail('${food.name}')">
      <div class="flex items-center gap-3">
        <div class="text-3xl">${food.icon}</div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-primary">${food.name}</h3>
            ${getLevelTag(food.level)}
          </div>
          <p class="text-sm text-muted mt-1 line-clamp-1">${food.desc}</p>
        </div>
        <svg class="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
  `).join('');
}

// 渲染收藏列表
function renderFavorites() {
  const favoriteFoods = foodDatabase.filter(food => favorites.includes(food.name));
  
  resultCount.innerHTML = `<span class="text-primary">收藏了 ${favoriteFoods.length} 种食材</span>`;

  if (favoriteFoods.length === 0) {
    foodList.innerHTML = `
      <div class="text-center py-16">
        <div class="text-6xl mb-4">❤️</div>
        <p class="text-muted">还没有收藏任何食材</p>
        <p class="text-muted text-sm mt-1">点击食材详情可添加收藏</p>
      </div>
    `;
    emptyState.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  foodList.innerHTML = favoriteFoods.map(food => `
    <div class="glass-card rounded-2xl p-4 cursor-pointer active:scale-98 transition-transform"
         onclick="showDetail('${food.name}')">
      <div class="flex items-center gap-3">
        <div class="text-3xl">${food.icon}</div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-primary">${food.name}</h3>
            ${getLevelTag(food.level)}
          </div>
          <p class="text-sm text-muted mt-1 line-clamp-1">${food.desc}</p>
        </div>
        <svg class="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
  `).join('');
}

// 获取等级标签
function getLevelTag(level) {
  const tags = {
    recommend: '<span class="px-2 py-0.5 text-xs rounded-full btn-recommend">推荐</span>',
    caution: '<span class="px-2 py-0.5 text-xs rounded-full btn-caution">慎吃</span>',
    avoid: '<span class="px-2 py-0.5 text-xs rounded-full btn-avoid">禁吃</span>'
  };
  return tags[level] || '';
}

// 显示详情弹窗
function showDetail(name) {
  const food = foodDatabase.find(f => f.name === name);
  if (!food) return;

  const levelText = {
    recommend: '✅ 推荐食用',
    caution: '⚠️ 谨慎食用',
    avoid: '❌ 禁止食用'
  };

  const levelClass = {
    recommend: 'tag-recommend',
    caution: 'tag-caution',
    avoid: 'tag-avoid'
  };

  const isFavorite = favorites.includes(food.name);

  document.getElementById('detailTitle').textContent = food.name;
  document.getElementById('detailTag').className = `inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium mb-4 ${levelClass[food.level]}`;
  document.getElementById('detailTag').textContent = levelText[food.level];
  document.getElementById('detailDesc').textContent = food.desc;
  document.getElementById('detailNutrition').textContent = food.nutrition;
  document.getElementById('detailNotice').textContent = food.notice;
  document.getElementById('detailRecipe').textContent = food.recipe;

  // 添加收藏按钮
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = `ml-2 px-3 py-1 rounded-full text-sm ${isFavorite ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`;
  favoriteBtn.innerHTML = isFavorite ? '❤️ 已收藏' : '🤍 收藏';
  favoriteBtn.onclick = (e) => {
    e.stopPropagation();
    toggleFavorite(food.name);
    showDetail(food.name);
  };

  const titleContainer = document.querySelector('#detailTitle').parentElement;
  const existingBtn = titleContainer.querySelector('.favorite-btn');
  if (existingBtn) existingBtn.remove();
  favoriteBtn.classList.add('favorite-btn');
  titleContainer.appendChild(favoriteBtn);

  detailModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// 关闭详情弹窗
function closeDetail() {
  detailModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// 切换收藏
function toggleFavorite(name) {
  const index = favorites.indexOf(name);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('pregnantFoodFavorites', JSON.stringify(favorites));
  
  // 如果当前在收藏页面，重新渲染
  const activeNav = document.querySelector('.nav-btn.active');
  if (activeNav && activeNav.dataset.tab === 'favorite') {
    renderFavorites();
  }
}

// 小红书搜索
function searchXiaohongshu(keyword) {
  const searchKeyword = keyword || searchQuery || '孕妇饮食';
  const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent('孕妇 ' + searchKeyword)}`;
  window.open(url, '_blank');
}

// 键盘ESC关闭弹窗
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !detailModal.classList.contains('hidden')) {
    closeDetail();
  }
});

// 启动应用
init();
