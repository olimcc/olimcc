(ns olimcc.core
  (:use compojure.core)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]))

(defn handler []
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body "Hello World"})

(defroutes main-routes
  (GET "/" [] (handler))
  (route/resources "/" {:root "static"})
  (route/not-found "Page not found"))

(def app
  (handler/site main-routes))