<template>
  <!-- Page Footer-->
  <!-- Footer Alternative-->
  <footer
    class="footer"
  >
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <NuxtLink to="/" class="footer-logo">
            <img src="~/assets/logos/footer-logo.svg" alt="Footer Logo">
          </NuxtLink>
        </div>
        <div class="col-md-6">
          <div class="footer-menu">
            <ul>
              <li><a href="#">Terms & Condition</a></li>
              <li><a href="#">Legal</a></li>
              <li><a href="#">Contract</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-3">
          <div class="copyright">
            &copy; 2021 Bidify
          </div>
        </div>
        <div class="offset-md-6 col-md-3">
          <div class="footer-social">
            <ul>
              <li>
                <a href="https://www.instagram.com/flufworld/?hl=en">
                  <img src="~/assets/icons/icon-instagram.svg" alt="">
                </a>
              </li>
              <li>
                <a href="https://twitter.com/FLUF_World">
                  <img src="~/assets/icons/icon-twitter.svg" alt="">
                </a>
              </li>
              <li>
                <a href="https://github.com/Bidify">
                  <img src="~/assets/icons/icon-github.svg" alt="">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  components: {
  }
}
</script>
