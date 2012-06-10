(ns olimcc.core
  (:use [ring.util.response]
        [compojure.core]
        [olimcc.config :only (properties)])
  (:require [clojure.java.io :as io]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [clj-http.client :as client]))

(defn handler []
  ;; doesn't seem to work:
  ;; (file-response "test.html" {:root "pages"})
  (resource-response "index.html" {:root "pages"}))

(defn get-location []
  (let [endpoint "https://www.google.com/latitude/apps/badge/api?type=json&user="
        user ((properties) :user)]
        (client/get (str endpoint user))))

(defroutes main-routes
  (GET "/" [] (handler))
  (GET "/location" [] (get-location))
  (route/resources "/" {:root "static"})
  (route/not-found "Page not found"))

(def app
  (handler/site main-routes))