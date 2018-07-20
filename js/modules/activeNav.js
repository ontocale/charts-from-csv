
const setActiveNav = (e) => {
  let activeNav = document.querySelector('.main-nav .active')
  activeNav.classList.remove('active')
  activeNav = e.target
  activeNav.classList.add('active')
}

export default setActiveNav
