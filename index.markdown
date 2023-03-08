---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">

<section class="profile">
          <img src="images/giyu.gif" alt="Photo de profil" style="border-radius:50%;">
          <h2>Cybersecurity enthousiast</h2>
          <div class="external-links">
            <a title="Flux RSS" href="/feed.xml"><i class="fas fa-rss"></i></a>
            <a title="Github"   href="https://github.com/hashgrem"><i class="fab fa-github"></i></a>
            <a title="Linkedin" href="https://www.linkedin.com/in/j%C3%A9r%C3%A9my-demard-102b35238/"><i class="fab fa-linkedin"></i></a>
            <a title="root-me"  href="root-me.org/teiiko"><img src="images/root-me.svg" class="root-me"></a>
          </div>
</section>

<style>
  .profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  max-width: 800px;
}

.profile img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.profile h2 {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.external-links {
  display: flex;
  justify-content: center;
}

.external-links a {
  margin: 0 20px;
  font-size: 30px;
  color: #333;
}

.root-me {
  height: 45px !important;
  width: 45px !important;
}

@media only screen and (max-width: 768px) {
  .profile img {
    width: 150px;
    height: 150px;
  }

  .profile h2 {
    font-size: 24px;
  }

  .external-links a {
    font-size: 24px;
  }

  .root-me {
    height: 35px !important;
    width: 35px !important;
  }
}

</style>
    