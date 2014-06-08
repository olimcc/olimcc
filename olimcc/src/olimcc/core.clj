(ns olimcc.core
  (:use [ring.util.response]
        [ring.adapter.jetty :refer [run-jetty]]
        [compojure.core]
        [olimcc.config :only (properties)]
        [clojure.tools.logging :only (info error)])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [clj-http.client :as client]))

(defn idx-handler [page]
  ;; doesn't seem to work:
  ;; (file-response "test.html" {:root "pages"})
  (resource-response (str page ".html") {:root "pages"}))

(defroutes main-routes
  (GET "/" [] (idx-handler "index"))
  (GET "/:page" [page] (idx-handler page))
  (route/resources "/static" {:root "static"})
  (route/not-found "Page not found"))

(defn -main []
  (run-jetty (handler/site main-routes) {:port 8080}))
