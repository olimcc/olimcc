(ns olimcc.handler
  (:require [cheshire.core :as json]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.java.jdbc :as jdbc]
            [ring.middleware.logger :as logger]
            [clojure.tools.logging :as log]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(def db-spec
  {:classname   "org.sqlite.JDBC"
   :subprotocol "sqlite"
   :subname     (format "/%s/olimcc-app-data/olimcc-sqlite.db"
                        (System/getProperty "user.home"))})

(defn exists?
  "Check whether a given table exists."
  [db-spec table-key]
  (try
    (do
      (->> (format "select 1 from %s" (name table-key))
           (vector)
           (jdbc/query db-spec))
      true)
    (catch Throwable ex
      false)))

(defn create-db []
  (let [table-name :location]
    (log/infof "attempting table creation for %s" table-name)
    (if-not (exists? db-spec table-name)
      (try (jdbc/db-do-commands db-spec
                                (jdbc/create-table-ddl table-name
                                                       [:lat :real]
                                                       [:lng :real]
                                                       [:timestamp :integer]
                                                       [:note :text]))
           (catch Exception e (println e)))
      (log/infof "table %s already exists, will not create" table-name))))

;; handlers
(defn location-handler
  [req]
  (let [params (:params req)]
    (when (-> params :lat (= nil) not)
      (jdbc/insert! db-spec :location {:lat (:lat params)  :lng (:lon params)
                                       :timestamp (System/currentTimeMillis)})))
  {:body (json/generate-string (jdbc/query db-spec "select * from location"))
   :headers {"Content-Type" "application/json"}})

(defn wrap-dir-index [handler]
  (fn [req]
    (handler
     (update-in req [:uri]
                #(if (= "/" %) "/index.html" %)))))

(defroutes app-routes
  (GET "/location" [] location-handler)
  (route/not-found "Not Found"))

(defn init
  "Initialize the app. Called once at startup."
  []
  (create-db))

(def app
(wrap-dir-index
  (logger/wrap-with-logger
    (wrap-defaults app-routes site-defaults))))
