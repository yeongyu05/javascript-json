const categorysData = await fetch('./json/categorys.json').then(res => res.json());
const membersData = await fetch('./json/members.json').then(res => res.json());
const postsData = await fetch('./json/posts.json').then(res => res.json());
const container = document.querySelector('.container');
const modal = document.querySelector('.modal');

let previews;
let page = 1;

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
    document.body.classList.add('hidden');
    const { date, title, contents, member, category } = previews.filter(post => post.index === parseInt(e.currentTarget.dataset.index))[0];
    modal.classList.remove('none');
    modal.classList.add('flex');
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

const handleModalClick = e => {
    if (!e.target.classList.contains('modal')) return;
    document.body.classList.remove('hidden');
    modal.classList.remove('flex');
    modal.classList.add('none');
    modal.innerHTML = '';
}

const evt = () => {
    window.addEventListener('scroll', handleWindowScroll);
    modal.addEventListener('click', handleModalClick);
}

const init = () => {
    evt();
    render();
}

init();