/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
  var connect_btn = document.getElementById('connect_btn');
  var username = document.getElementById('username');
  var loginbox = document.getElementById('loginbox');
  var chatbox = document.getElementById('chatbox');
   message = document.getElementById('message');
  var url = 'ws://localhost:3000';
  var socket = io.connect(url);


  socket.on('login', function (o) {
    console.log('login 登录成功');
    //console.log(obj);
    var onlinecount = document.getElementById('onlinecount');
    var count = o.onlineCount;
    var name = '';
    for (var i in o.onlineUsers) {
      name += o.onlineUsers[i] + "、";
    }
    onlinecount.innerHTML = "当前在线人数为:" + count + " " + "用户名为:" + name;
    var msg = document.getElementById("message");
    var load_msg = document.createElement("div");
    msg.appendChild(load_msg);
    load_msg.classList.add('center_load');
    load_msg.innerHTML = o.user.username + "进入了聊天室";
  })

  socket.on('logout', function (obj) {
    console.log('logout 用户退出');
    var _msg = document.getElementById("message");
    var exit_msg = document.createElement("div");
    _msg.appendChild(exit_msg);
    exit_msg.classList.add('center_exit');
    exit_msg.innerHTML = obj.user.username + "退出了聊天室";
  })
  socket.on('message', function (obj) {
    console.log(obj);
    var isme=(obj.userid==genUid())?true:false;
    var contentDiv='<div>'+obj.content+"</div>";
    var usernameDiv='<span>'+obj.username+"</span>";
    var content_div = document.createElement("div");
    var section=document.createElement("section")
    if(isme){
      section.className='user';
      section.innerHTML=contentDiv+usernameDiv;
    }else {
      section.className='service';
      section.innerHTML=usernameDiv+contentDiv;
    }
    var d = document.getElementById("message");
    d.appendChild(section);

  });
  var mjr_send = document.getElementById('mjr_send');
  var content = document.getElementById('content');
  mjr_send.onclick = function () {
    var obj = {
      userid: genUid(),
      username: username.value,
      content: content.value
    };
    socket.emit('message', obj)
  }
  function genUid() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
  }

  connect_btn.onclick = function () {
    if (username.value == "") {
      alert("用户名不能为空!")
    } else {
      loginbox.style.display = "none";
      chatbox.style.display = "block";

      socket.emit('login', {
        userid: genUid(),
        username: username.value
      });

    }
  }

})()