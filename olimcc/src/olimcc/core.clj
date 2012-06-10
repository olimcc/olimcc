(ns olimcc.core
  (:use [ring.util.response]
        [compojure.core])
  (:require [clojure.java.io :as io]
            [compojure.route :as route]
            [compojure.handler :as handler]))

(defn handler []
  ;; doesn't seem to work:
  ;; (file-response "test.html" {:root "pages"})
  (resource-response "index.html" {:root "pages"}))

(defroutes main-routes
  (GET "/" [] (handler))
  (route/resources "/" {:root "static"})
  (route/not-found "Page not found"))

(def app
  (handler/site main-routes))