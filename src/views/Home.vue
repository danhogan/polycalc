<template>
    <div class="home">
        <!-- Attacker -->
        <v-container class="unitSelectContainer">
            <v-row>
                <v-col cols="12" sm="12" md="8">
                    <selection v-model="selectedAttacker" :passedItems="attackers" :labelName="'Attacker'"></selection>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="attackerVeteran"
                        label="Veteran"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="boost"
                        label="Boost"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-container>
        
        <v-card-text>
            <slider
                v-model="attackerHealth"
                :label="'Attacker Health'"
                :maxHealth="attackerMax"
                :minHealth="attackerMinHealth"
                :thumbColor="attackerColor"
                :clicky="attackTopBar"
                v-on="$listeners"
            ></slider>
        </v-card-text>

        <!-- Defender -->
        <v-container class="unitSelectContainer">
            <v-row>
                <v-col cols="12" sm="12" md="8">
                    <selection v-model="selectedDefender" :passedItems="defenders" :labelName="'Defender'"></selection>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="defenderVeteran"
                        label="Veteran"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="poison"
                        label="Poisoned"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-container>

        <v-container class="bonusContainer">
            <v-row>
                <v-col>
                    <v-checkbox
                        v-model="defenseBonus"
                        @click="wallBonus ? (wallBonus = !defenseBonus) : ''"
                        label="Defense Bonus"
                        value="defense"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="wallBonus"
                        @click="defenseBonus ? (defenseBonus = !wallBonus) : ''"
                        label="Wall Bonus"
                        value="wall"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-container>
        
        <v-card-text>
            <!-- consolidate everything and just use bool for attacker or defender? -->
            <slider
                v-model="defenderHealth"
                :label="'Defender Health'"
                :maxHealth="defenderMax"
                :minHealth="defenderMinHealth"
                :thumbColor="defenderColor"
                :clicky="defenseTopBar"
                v-on="$listeners"
            ></slider>
        </v-card-text>

        <v-container class="resultContainer">
            <p>{{attackerCalcText}}</p>
            <p>{{defenderCalcText}}</p>
        </v-container>

        <v-btn elevation="5" block x-large color="primary" @click="attack()">Attack!</v-btn>
        <v-btn elevation="5" icon color="secondary" class="refresh" @click="reset()">
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
    </div>
</template>

<script>
import allUnits from '@/units';
import selection from '../components/selection.vue'
import slider from '../components/slider.vue'

let destruction = [
    'DESTROYED',
    'PULVERIZED',
    'ANNIHILATED',
    'TORCHED',
    'SANDWICHED',
    'CRUSHED',
    'SHOT INTO SPACE'
]

export default {
    name: "Home",
    components: {
        selection,
        slider
    },
    data() {
        return {
            selectedAttacker: 'Warrior',
            selectedDefender: 'Warrior',
            attackerMax: 10,
            attackerHealth: 10,
            attackValue: 2,
            defenderMax: 10,
            defenderHealth: 10,
            defenseValue: 2,
            defenseBonus: false,
            wallBonus: false,
            attackerVeteran: false,
            defenderVeteran: false,
            attackerMinHealth: 1,
            defenderMinHealth: 1,
            boost: false,
            poison: false
        };
    },
    methods: {
        attack() {
            let defenseBonus = this.defenseBonus ? 1.5 : this.wallBonus ? 4 : 1;
            if (this.poison){ this.defenseBonus *= 0.8; }
            if (this.boost){ this.attackValue += 0.5; }
            let attackForce = this.attackValue * (this.attackerHealth / this.attackerMax);
            let defenseForce = this.defenseValue * (this.defenderHealth / this.defenderMax) * defenseBonus;
            let totalDamage = attackForce + defenseForce;
            let attackResult = Math.round((attackForce / totalDamage) * this.attackValue * 4.5);
            let defenseResult = Math.round((defenseForce / totalDamage) * this.defenseValue * 4.5);

            this.defenderHealth = this.defenderHealth - attackResult;

            if (this.defenderHealth > 0){ //defender only retaliates if still alive
                this.attackerHealth = this.attackerHealth - defenseResult;
            }

            if (this.attackerHealth <= 0){
                this.attackerMinHealth = this.attackerHealth;
            } else {
                this.attackerMinHealth = 0;
            }
            
            if (this.defenderHealth <= 0){
                this.defenderMinHealth = this.defenderHealth;
            } else {
                this.defenderMinHealth = 0;
            }
        },
        reset() {
            this.attackerHealth = this.attackerMax;
            this.defenderHealth = this.defenderMax;
        },
        attackTopBar(){
            this.$emit('showTopBar', this.attackerHealth);
        },
        defenseTopBar(){
            this.$emit('showTopBar', this.defenderHealth);
        }
    },
    computed: {
        attackerColor() { //lots of duplication up in here
            if (this.attackerHealth <= 0) return "grey";
            if (this.attackerHealth < (this.attackerMax * 0.33)) return "red";
            if (this.attackerHealth < (this.attackerMax * 0.66)) return "yellow darken-2";
            return "green";
        },
        defenderColor() {
            if (this.defenderHealth <= 0) return "grey";
            if (this.defenderHealth < (this.defenderMax * 0.33)) return "red";
            if (this.defenderHealth < (this.defenderMax * 0.66)) return "yellow darken-2";
            return "green";
        },
        attackers() {
            return allUnits.filter(x => x.attackValue).map(y => y.name).sort((a, b) => a.localeCompare(b));
        },
        defenders() {
            return allUnits.filter(x => x.defenseValue).map(y => y.name).sort((a, b) => a.localeCompare(b));
        },
        attackerCalcText() {
            return `Attacker ${this.attackerHealth > 0 ? 'survives' : `is ${destruction[Math.floor(Math.random() * destruction.length)]}`} with ${this.attackerHealth} health.`;
        },
        defenderCalcText() {
            return `Defender ${this.defenderHealth > 0 ? 'survives' : `is ${destruction[Math.floor(Math.random() * destruction.length)]}`} with ${this.defenderHealth} health.`;
        },
    },
    watch: {
        selectedAttacker() {
            this.attackerMax = this.attackerHealth = allUnits.find(x => x.name == this.selectedAttacker).maxHP;
            this.attackValue = allUnits.find(x => x.name == this.selectedAttacker).attackValue;
        },
        selectedDefender() {
            this.defenderMax = this.defenderHealth = allUnits.find(x => x.name == this.selectedDefender).maxHP;
            this.defenseValue = allUnits.find(x => x.name == this.selectedDefender).defenseValue;
        },
        attackerVeteran() { //slider is messed up
            if (this.attackerMax == this.attackerHealth){
                this.attackerHealth = this.attackerVeteran ? (this.attackerHealth + 5) : (this.attackerHealth - 5);
            }

            this.attackerMax = this.attackerVeteran ? (this.attackerMax + 5) : (this.attackerMax - 5);
        },
        defenderVeteran() {
            if (this.defenderMax == this.defenderHealth){
                this.defenderHealth = this.defenderVeteran ? (this.defenderHealth + 5) : (this.defenderHealth - 5);
            }

            this.defenderMax = this.defenderVeteran ? (this.defenderMax + 5) : (this.defenderMax - 5);
        },
        attackerHealth(){
            this.$emit('topBarValue', this.attackerHealth);
        },
        defenderHealth(){
            this.$emit('topBarValue', this.defenderHealth);
        }
    }
};
</script>

<style lang="scss" scoped>
    .home {
        max-width: 800px;
        margin: 0 auto;
    }

    .bonusContainer {
        padding-top: 0;
    }

    .unitSelectContainer {
        padding-bottom: 0;
    }

    .refresh {
        margin-top: 2em;
    }

    @media only screen and (max-width: 600px) {
        .v-card__text {
            padding-bottom: 0;
        }

        .v-input--selection-controls {
            margin-top: 0;
        }
    }
</style>
