(defproject olimcc "1.0.0-SNAPSHOT"
  :description "Olimcc site"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [compojure "1.1.0"]
                 [ring/ring-core "1.1.0"]
                 [ring/ring-jetty-adapter "1.1.0"]]
  :dev-dependencies [[lein-ring "0.7.1"]]
  :ring {:handler olimcc.core/app})

