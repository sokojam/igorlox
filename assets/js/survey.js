document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('surveyForm');
  const resetBtn=document.getElementById('resetSurvey');
  const modal=document.getElementById('surveyModal');
  const closeModal=null;
  const closeModalBtn=null;
  const surveySummary=document.getElementById('surveySummary');
  const personalizedAdvice=document.getElementById('personalizedAdvice');

  const STORAGE_KEY='market_opinion_survey_v1';

  function readValues(){
    const q1=document.getElementById('q1').value||null;
    const q2=document.getElementById('q2').value||null;
    const budgetStr=document.getElementById('q4').value.trim();
    const budget=budgetStr?Number(budgetStr):null;
    const email=(document.getElementById('q5').value||'').trim()||null;
    const q3=[...document.querySelectorAll('input[name="q3"]:checked')].map(i=>i.value);
    return { role:q1, companySize:q2, topics:q3, budget, email, ts:new Date().toISOString() };
  }

  function validateForm(){
    const q1=document.getElementById('q1').value;
    const q2=document.getElementById('q2').value;
    if(!q1 || !q2){
      alert('Пожалуйста, заполните обязательные поля (роль и размер компании)');
      return false;
    }
    return true;
  }

  function save(values){
    try{
      const all=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      all.push(values);
      localStorage.setItem(STORAGE_KEY,JSON.stringify(all));
    }catch(e){ console.warn('Storage failed',e); }
  }

  function generateAdvice(values){
    let advice = [];
    
    // Advice based on role
    if(values.role === 'Собственник/СЕО'){
      advice.push('💡 <strong>Для СЕО:</strong> Рекомендуем начать с экспресс-анализа рынка для понимания конкурентной среды и возможностей роста.');
    } else if(values.role === 'Маркетолог/Аналитик'){
      advice.push('📊 <strong>Для маркетолога:</strong> Опрос целевой аудитории поможет сегментировать клиентов и оптимизировать кампании.');
    } else if(values.role === 'Продажи/BD'){
      advice.push('🎯 <strong>Для продаж:</strong> Глубинные интервью с клиентами выявят барьеры покупки и улучшат конверсию.');
    }
    
    // Advice based on company size
    if(values.companySize === '1–10'){
      advice.push('🚀 <strong>Стартап:</strong> Начните с валидации продукта через опросы и тестирование цены.');
    } else if(values.companySize === '11–50'){
      advice.push('📈 <strong>Растущая компания:</strong> Фокус на сегментации и оптимизации маркетинговых каналов.');
    } else if(values.companySize === '51–200' || values.companySize === '200+'){
      advice.push('🏢 <strong>Крупная компания:</strong> Комплексное исследование с множественными методами сбора данных.');
    }
    
    // Advice based on topics
    if(values.topics.includes('Конъюнктура')){
      advice.push('📊 <strong>Конъюнктура:</strong> Анализ размера рынка, трендов и конкурентов за 1-2 недели.');
    }
    if(values.topics.includes('Опрос')){
      advice.push('📝 <strong>Опросы:</strong> 300-1000 респондентов для статистически значимых результатов.');
    }
    if(values.topics.includes('Интервью')){
      advice.push('🎤 <strong>Интервью:</strong> 15-20 глубинных интервью для понимания мотивации клиентов.');
    }
    if(values.topics.includes('Цены')){
      advice.push('💰 <strong>Ценообразование:</strong> PSM или Gabor-Granger для определения оптимальной цены.');
    }
    
    // Advice based on budget
    if(values.budget){
      if(values.budget < 100000){
        advice.push('💡 <strong>Бюджет до 100к:</strong> Рекомендуем пакет Start с экспресс-анализом.');
      } else if(values.budget < 300000){
        advice.push('💡 <strong>Бюджет 100-300к:</strong> Пакет Growth с опросом и аналитикой будет оптимальным.');
      } else {
        advice.push('💡 <strong>Бюджет 300к+:</strong> Enterprise-решение с кастомной программой исследований.');
      }
    }
    
    return advice.length > 0 ? advice.join('<br><br>') : '💡 <strong>Общий совет:</strong> Начните с экспресс-анализа для понимания текущей ситуации на рынке.';
  }

  function showSummary(values){
    const summary = `
      <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px;">
        <h4 style="margin: 0 0 12px; color: var(--text);">Ваши ответы:</h4>
        <p><strong>Роль:</strong> ${values.role || 'Не указано'}</p>
        <p><strong>Размер компании:</strong> ${values.companySize || 'Не указано'}</p>
        <p><strong>Интересующие задачи:</strong> ${values.topics.length > 0 ? values.topics.join(', ') : 'Не выбрано'}</p>
        <p><strong>Бюджет:</strong> ${values.budget ? values.budget.toLocaleString() + ' ₽' : 'Не указан'}</p>
        <p><strong>Email:</strong> ${values.email || 'Не указан'}</p>
      </div>
    `;
    
    const advice = `
      <div style="margin-top: 16px; padding: 16px; background: rgba(139,92,246,0.1); border-radius: 8px; border-left: 4px solid var(--primary);">
        <h4 style="margin: 0 0 12px; color: var(--text);">Персональные рекомендации:</h4>
        <div style="color: var(--muted-2); line-height: 1.6;">
          ${generateAdvice(values)}
        </div>
      </div>
    `;
    
    surveySummary.innerHTML = summary;
    personalizedAdvice.innerHTML = advice;
    modal.classList.add('show');
  }

  function closeModalHandler(){
    modal.classList.remove('show');
  }

  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!validateForm()) return;
      const values=readValues();
      save(values);
      showSummary(values);
    });
  }

  if(resetBtn){
    resetBtn.addEventListener('click',()=>{
      try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
      if(form) form.reset();
      // Hide modal if it's open
      modal.classList.remove('show');
    });
  }

  // Modal event listeners
  if(modal){
    modal.addEventListener('click', (e) => {
      if(e.target === modal){
        closeModalHandler();
      }
    });
  }
});


