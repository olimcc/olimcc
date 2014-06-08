(defproject olimcc "0.7"
  :description "Olimcc site"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [org.clojure/tools.logging "0.2.3"]
                 [ring "1.2.1"]
                 [compojure "1.1.0"]
                 [ring/ring-core "1.1.0"]
                 [ring/ring-jetty-adapter "1.1.0"]
                 [clj-http "0.4.3"]]
  :dev-dependencies [[lein-ring "0.8.10"]]
  :plugins [[lein-ring "0.8.10"]]
  :ring {:handler olimcc.core/app})

