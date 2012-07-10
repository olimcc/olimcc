(defproject olimcc "0.5"
  :description "Olimcc site"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [org.clojure/tools.logging "0.2.3"]
                 [compojure "1.1.0"]
                 [ring/ring-core "1.1.0"]
                 [ring/ring-jetty-adapter "1.1.0"]
                 [clj-http "0.4.3"]]
  :dev-dependencies [[lein-ring "0.7.1"]]
  :ring {:handler olimcc.core/app})

