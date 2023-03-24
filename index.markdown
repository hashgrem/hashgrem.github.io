---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<script src="/js/typelighter.min.js"></script>

<section class="profile">
          <img src="images/giyu.gif" alt="Photo de profil" style="border-radius:50%;">
          <h2 id='writer'>Cybersecurity <span class="typeWriter" data-speed="2" data-text='["student", "enthusiast", "practitioner"]'></span></h2>
          <div class="external-links">
            <a title="Flux RSS" target="_blank" id ='rss' href="/feed.xml"><i class="fas fa-rss"></i></a>
            <a title="Github"   target="_blank" id='github' href="https://github.com/hashgrem"><i class="fab fa-github"></i></a>
            <a title="Linkedin" target="_blank" id='linkedin' href="https://www.linkedin.com/in/j%C3%A9r%C3%A9my-demard-102b35238/"><i class="fab fa-linkedin"></i></a>
            <a title="Root-Me"  target="_blank" href="https://root-me.org/teiiko"><img src="images/root-me.svg" class="root-me"></a>
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
  transition: transform 0.2s ease;
}

.external-links a:hover {
    transform: scale(1.3);
    transform: rotateZ(20deg);
}

#rss:hover{
  color:orange;
}

#linkedin:hover{
  color:#1b65d1;
}

#github:hover{
  color:grey;
}

.root-me {
  height: 40px !important;
  width: 40px !important;
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
<script src="/js/darktheme.js"></script>
