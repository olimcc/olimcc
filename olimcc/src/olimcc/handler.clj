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

(defn get-locations
  [db-spec start-timestamp]
  (jdbc/query db-spec
              ["select * from location WHERE timestamp >= ? ORDER BY timestamp DESC LIMIT 100"
               start-timestamp]))

(defn insert-location
  [db-spec lng lat]
  (jdbc/insert! db-spec :location {:lat lat  :lng lng
                                   :timestamp (System/currentTimeMillis)}))

;; handlers
(defn location-handler
  [req]
  (let [params (:params req)]
    (when (-> params :lat (= nil) not)
      (insert-location db-spec (:lon params) (:lat params)))
    (let [start-ts (or (when-let [s (:start params)] (Long/parseLong s))
                       (- (System/currentTimeMillis) (* 60 60 1000)))]
      {:body (json/generate-string (get-locations db-spec start-ts)
                                   {:pretty (-> params :pretty boolean)})
       :headers {"Content-Type" "application/json"}})))

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


(comment
  (def test-locs [[-122.462282, 37.771961]
                  [-122.480993, 37.770062]
                  [-122.500734, 37.767958]
                  [-122.512407, 37.768094]
                  [-122.505380, 37.760396]
                  [-122.498760, 37.760834]
                  [-122.487431, 37.768162]
                  [-122.461681, 37.772029]
                  [-122.443571, 37.773318]
                  [-122.430267, 37.771215]
                  [-122.429280, 37.765910]])

  (defn delete-all-locs
    []
    (jdbc/delete! db-spec :location []))

  (defn load-test-locs []
    (doseq [loc test-locs]
      (Thread/sleep 500)
      (insert-location db-spec (first loc) (second loc))))

  (delete-all-locs)
  (load-test-locs)
  (get-locations db-spec 0)

  )
