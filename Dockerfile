FROM nginx:alpine

# Copiar configuracion personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estaticos del sitio web
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de arranque por defecto
CMD ["nginx", "-g", "daemon off;"]
