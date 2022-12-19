const categorysData = await fetch('./json/categorys.json').then(res => res.json());
const membersData = await fetch('./json/members.json').then(res => res.json());
const postsData = await fetch('./json/posts.json').then(res => res.json());
const container = document.querySelector('.container');
const modal = document.querySelector('.modal');

let previews;
let page = 1;
let isEdit = false;

const getViewPosts = () => postsData.map(post => post = {
    index: post.index,
    date: post.date,
    title: post.title,
    contents: post.contents,
    member: membersData[post.memberIndex].name,
    category: post.categorys.map(e => categorysData[e])
});

const compareDate = (prev, next) => next.date.split('-').join('') - prev.date.split('-').join('');

const handlePostClick = e => {
    const { date, title, contents, member, category } = previews.filter(post => post.index === parseInt(e.currentTarget.dataset.index))[0];
    document.body.classList.add('hidden');
    modal.classList.replace('none', 'flex');
    modal.innerHTML = `
        <div class="popup">
            <div class="thumbnail"></div>
            <div class="contentWrap">
                <div class="preview">
                    <div class="title">${title}</div>
                    <div class="contents">${contents}</div>
                    <div class="category">${category.map(e => `<span style="background: ${e.color};">#${e.name}</span>`).join('')}</div>
                </div>
                <div class="info flex">
                    <div class="member">by ${member}</div>
                    <div class="date">${date}</div>
                </div>
            </div>
        </div>
    `;
}

const render = () => {
    container.innerHTML = '';
    previews = getViewPosts().sort(compareDate).splice(0, page*20);
    previews.forEach(({ index, date, title, contents, member }) => {
        const post = document.createElement('div');
        post.dataset.index = index;
        post.className = 'post';
        post.innerHTML = `
            <div class="thumbnail"></div>
            <div class="contentWrap">
                <div class="preview">
                    <div class="title">${title}</div>
                    <div class="contents">${contents}</div>
                </div>
                <div class="info flex">
                    <div class="member">by ${member}</div>
                    <div class="date">${date}</div>
                </div>
            </div>
        `;
        container.appendChild(post);
        post.addEventListener('click', handlePostClick);
    })
}

const handleWindowScroll = () => {
    let value = window.innerHeight + window.scrollY;
    if(value >= document.body.offsetHeight) {
        page + 1 > 16 ? 16 : page++;
        render();
    }
}

const handleCategoryInputFocusout = e => {
    const category = e.target.parentNode;
    isEdit = false;
    category.removeChild(e.target);
    if(!e.target.value.trim()) return;
    const tag = document.createElement('span');
    const [categoryData] = categorysData.filter(v => v.name === e.target.value);
    tag.innerText = e.target.value;
    tag.style.background = categoryData ? categoryData.color : '#333';
    category.appendChild(tag);
}
const handleCategoryInputKeydown = e => {
    const key = e.key;
    const isAdd = ['Enter'].includes(key);
    if(!isAdd) return;
    const category = e.target.parentNode;
    isEdit = false;
    e.target.removeEventListener('focusout', handleCategoryInputFocusout);
    category.removeChild(e.target);
    if(!e.target.value.trim()) return;
    const tag = document.createElement('span');
    const [categoryData] = categorysData.filter(v => v.name === e.target.value);
    tag.innerText = e.target.value;
    tag.style.background = categoryData ? categoryData.color : '#333';
    category.appendChild(tag);
}

const addTag = () => {
    const category = modal.querySelector('.category');
    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('type', 'text');
    !isEdit && category.appendChild(categoryInput);
    isEdit = true;
    categoryInput.focus();
    categoryInput.addEventListener('focusout', handleCategoryInputFocusout);
    categoryInput.addEventListener('keydown', handleCategoryInputKeydown);
}

const handleMemberInputFocusout = e => {
    const member = e.target.parentNode;
    isEdit = false;
    member.removeChild(e.target);
    if(!e.target.value.trim()) return;
    const span = document.createElement('span');
    membersData.map(v => console.log(v));
    span.innerText = e.target.value;
    span.style.background = categoryData ? categoryData.color : '#333';
    category.appendChild(span);
}
const handleMemberInputKeydown = () => {

}

const addMember = () => {
    const member = modal.querySelector('.member');
    const memberInput = document.createElement('input');
    memberInput.setAttribute('type', 'text');
    !isEdit && member.appendChild(memberInput);
    isEdit = true;
    memberInput.focus();
    memberInput.addEventListener('focusout', handleMemberInputFocusout);
    memberInput.addEventListener('keydown', handleMemberInputKeydown);
}

const handleModalDbclick = e => {
    if(e.target.classList.contains('category')) addTag();
    if(e.target.classList.contains('member')) addMember();
}

const handleWindowKeydown = e => {
    if(!e.ctrlKey || !e.shiftKey) return;
    document.body.classList.add('hidden');
    modal.classList.replace('none', 'flex');
    modal.innerHTML = `
        <div class="popup">
            <div class="thumbnail"></div>
            <div class="contentWrap">
                <div>
                    <div class="tagList"></div>
                    <div class="category">category</div>
                    <div class="member">member by </div>
                </div>
            </div>
        </div>
    `;
    const tagList = modal.querySelector('.tagList');
    tagList.innerText = categorysData.map(e => e.name).join(', ');
    modal.addEventListener('dblclick', handleModalDbclick);
}

const handleModalClick = e => {
    if (!e.target.classList.contains('modal')) return;
    document.body.classList.remove('hidden');
    modal.classList.replace('flex', 'none');
    modal.innerHTML = '';
}

const evt = () => {
    window.addEventListener('scroll', handleWindowScroll);
    window.addEventListener('keydown', handleWindowKeydown);
    modal.addEventListener('click', handleModalClick);
}

const init = () => {
    evt();
    render();
}

init();